-- ════════════════════════════════════════════════════════════════════════
-- 0004 — RLS ET PROCÉDURES
--
-- Décision de sécurité D1 : la frontière A1 (corpus mutualisé / couche
-- personnelle) n'est pas seulement une frontière de coût, c'est la frontière
-- de sécurité. Elle se traduit littéralement en deux familles de politiques.
--
--   Corpus mutualisé  → lecture pour tout utilisateur authentifié,
--                       écriture réservée à la clé de service (ingestion).
--   Couche personnelle → tout est cloisonné par auth.uid().
-- ════════════════════════════════════════════════════════════════════════

-- ─── Corpus mutualisé : lisible par tous, écrit par personne ────────────

do $$
declare t text;
begin
  foreach t in array array[
    'editeur','referentiel','evaluation_editoriale','source','item',
    'rendition','alignement','evenement','rattachement','jalon',
    'synthese','assertion','citation','couverture'
  ] loop
    execute format('alter table prisme.%I enable row level security', t);
    execute format(
      'create policy "lecture authentifiee" on prisme.%I
         for select to authenticated using (true)', t);
  end loop;
end $$;

-- Aucune politique d'écriture : les clients ne peuvent pas insérer, modifier
-- ni supprimer. Le pipeline d'ingestion utilise la clé de service, qui
-- contourne RLS. C'est volontairement le seul chemin d'écriture.

-- Exception : confirmer ou séparer un rattachement candidat est un geste
-- utilisateur qui améliore le corpus de tous. Il passe par une procédure
-- contrôlée, jamais par un UPDATE direct.

-- ─── Couche personnelle : cloisonnée par utilisateur ────────────────────

do $$
declare t text;
begin
  foreach t in array array[
    'profil','abonnement','sujet_suivi','progression','session',
    'regle','annotation','collection','connecteur_sortie'
  ] loop
    execute format('alter table prisme.%I enable row level security', t);
    execute format(
      'create policy "proprietaire seul" on prisme.%I
         for all to authenticated
         using (%s = (select auth.uid()))
         with check (%s = (select auth.uid()))',
      t,
      case when t = 'profil' then 'id' else 'utilisateur_id' end,
      case when t = 'profil' then 'id' else 'utilisateur_id' end);
  end loop;
end $$;

-- Tables jointes : la propriété se déduit du parent.

alter table prisme.entree_file enable row level security;
create policy "via la session" on prisme.entree_file
  for all to authenticated
  using (exists (select 1 from prisme.session s
                  where s.id = session_id and s.utilisateur_id = (select auth.uid())))
  with check (exists (select 1 from prisme.session s
                  where s.id = session_id and s.utilisateur_id = (select auth.uid())));

alter table prisme.rappel enable row level security;
create policy "via l annotation" on prisme.rappel
  for all to authenticated
  using (exists (select 1 from prisme.annotation a
                  where a.id = annotation_id and a.utilisateur_id = (select auth.uid())))
  with check (exists (select 1 from prisme.annotation a
                  where a.id = annotation_id and a.utilisateur_id = (select auth.uid())));

alter table prisme.annotation_collection enable row level security;
create policy "via l annotation" on prisme.annotation_collection
  for all to authenticated
  using (exists (select 1 from prisme.annotation a
                  where a.id = annotation_id and a.utilisateur_id = (select auth.uid())))
  with check (exists (select 1 from prisme.annotation a
                  where a.id = annotation_id and a.utilisateur_id = (select auth.uid())));

-- ════════════════════════════════════════════════════════════════════════
-- PROCÉDURES — les transitions que le serveur doit arbitrer
--
-- Annexe B de la boucle 2 : `sujet_suivi.statut` est d'autorité SERVEUR.
-- La North Star en dépend ; elle ne peut pas être calculée sur un état que
-- le client a écrit lui-même. D'où une RPC plutôt qu'un UPDATE ouvert.
-- ════════════════════════════════════════════════════════════════════════

-- Clore un sujet.
--
-- Le geste est le même pour l'utilisateur ; l'enregistrement diffère. Sans
-- substance, on n'écrit PAS « bouclé » : on écrit « écarté ». On ne bloque
-- personne, et on ne laisse pas la métrique se remplir de faux.
create or replace function prisme.boucler_sujet(p_sujet_id uuid)
returns prisme.sujet_suivi
language plpgsql
security definer
set search_path = prisme, public
as $$
declare
  s prisme.sujet_suivi;
  a_substance boolean;
begin
  select * into s from prisme.sujet_suivi
   where id = p_sujet_id and utilisateur_id = auth.uid()
   for update;

  if not found then
    raise exception 'sujet introuvable' using errcode = 'no_data_found';
  end if;

  -- Seuils de la boucle 1 §6 : hypothèses à calibrer, jamais mesurées.
  select exists (
    select 1 from prisme.progression p
     where p.sujet_suivi_id = s.id
       and (
         (p.modalite_derniere in ('audio_natif','audio_synthese')
           and (p.taux_completion >= 0.60 or p.secondes_actives >= 180))
         or
         (p.modalite_derniere not in ('audio_natif','audio_synthese')
           and (p.taux_completion >= 0.70 or p.secondes_actives >= 90))
       )
  ) into a_substance;

  update prisme.sujet_suivi
     set statut             = case when a_substance then 'boucle' else 'ecarte' end,
         boucle_le          = case when a_substance then now() else null end,
         substance_atteinte = a_substance
   where id = s.id
   returning * into s;

  return s;
end;
$$;

-- Reporter un sujet. L'échéance est OBLIGATOIRE : il n'existe aucun
-- « plus tard » sans date dans ce produit.
create or replace function prisme.reporter_sujet(
  p_sujet_id uuid,
  p_echeance timestamptz
)
returns prisme.sujet_suivi
language plpgsql
security definer
set search_path = prisme, public
as $$
declare s prisme.sujet_suivi;
begin
  if p_echeance is null or p_echeance <= now() then
    raise exception 'un report exige une échéance future'
      using errcode = 'check_violation';
  end if;

  update prisme.sujet_suivi
     set reporte_au = p_echeance,
         nb_reports = nb_reports + 1
   where id = p_sujet_id and utilisateur_id = auth.uid()
   returning * into s;

  if not found then
    raise exception 'sujet introuvable' using errcode = 'no_data_found';
  end if;
  return s;
end;
$$;

-- Trancher un rapprochement non confirmé. Geste utilisateur qui améliore le
-- corpus mutualisé — le seul chemin d'écriture client vers ce corpus.
create or replace function prisme.trancher_rattachement(
  p_rattachement_id uuid,
  p_confirme boolean
)
returns void
language plpgsql
security definer
set search_path = prisme, public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentification requise' using errcode = 'insufficient_privilege';
  end if;

  update prisme.rattachement
     set statut    = case when p_confirme then 'confirme' else 'rejete' end,
         confiance = case when p_confirme then greatest(confiance, 0.82) else confiance end
   where id = p_rattachement_id and statut = 'candidat';
end;
$$;

-- ─── Vues dérivées ──────────────────────────────────────────────────────
--
-- Les métriques de la boucle 1 sont CALCULÉES, jamais stockées : les figer
-- les rendrait divergentes et impossibles à réconcilier.

create or replace view prisme.v_sbu_hebdomadaire as
select
  ss.utilisateur_id,
  date_trunc('week', ss.boucle_le) as semaine,
  count(*) as sujets_boucles
from prisme.sujet_suivi ss
where ss.statut = 'boucle'
  and ss.substance_atteinte
  and ss.boucle_le is not null
  -- Fenêtre de fraîcheur : filtre de MESURE, jamais montré à l'utilisateur.
  and ss.boucle_le - ss.entre_le <= interval '7 days'
group by 1, 2;

create or replace view prisme.v_dette_informationnelle as
select
  ss.utilisateur_id,
  percentile_cont(0.5) within group (
    order by extract(epoch from (now() - ss.entre_le)) / 86400
  ) as age_median_jours,
  count(*) as sujets_en_attente
from prisme.sujet_suivi ss
where ss.statut in ('nouveau', 'en_cours')
group by 1;

-- Garde-fou principal : doit BAISSER. Si la NSM monte et que cette valeur
-- monte aussi, la thèse est perdue.
create or replace view prisme.v_temps_median_par_sujet_boucle as
select
  ss.utilisateur_id,
  date_trunc('week', ss.boucle_le) as semaine,
  percentile_cont(0.5) within group (order by ss.temps_consomme_s) as temps_median_s
from prisme.sujet_suivi ss
where ss.statut = 'boucle'
group by 1, 2;
