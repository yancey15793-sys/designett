-- ════════════════════════════════════════════════════════════════════════
-- 0003 — CONTRAINTES D'INTÉGRITÉ
--
-- Les principes produit deviennent ici des invariants de base de données.
-- Un principe qui ne vit que dans le code applicatif est un principe qui
-- saute au premier sprint sous pression.
-- ════════════════════════════════════════════════════════════════════════

-- ─── R8 · AUCUNE ASSERTION SANS CITATION ────────────────────────────────
--
-- La relation la plus importante du modèle. Contrainte DIFFÉRÉE : on peut
-- insérer une assertion puis ses citations dans la même transaction, mais
-- le COMMIT échoue si une assertion reste orpheline.
--
-- C'est la version la plus forte du principe 5 : ce que le schéma refuse de
-- stocker, aucune couche supérieure ne peut le diffuser.

create or replace function prisme.verifier_assertion_citee()
returns trigger
language plpgsql
as $$
declare
  n integer;
begin
  select count(*) into n
  from prisme.citation c
  where c.assertion_id = new.id;

  if n = 0 then
    raise exception
      'R8 : assertion % sans citation — une synthèse ne peut pas contenir de texte orphelin',
      new.id
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create constraint trigger assertion_doit_etre_citee
  after insert or update on prisme.assertion
  deferrable initially deferred
  for each row
  execute function prisme.verifier_assertion_citee();

-- Retirer la dernière citation d'une assertion rend la SYNTHÈSE ENTIÈRE non
-- servable. Elle n'est pas amputée puis servie : elle sort du service et
-- attend une régénération.
create or replace function prisme.invalider_synthese_si_orpheline()
returns trigger
language plpgsql
as $$
begin
  update prisme.synthese s
     set servable = false
   where s.id = (
     select a.synthese_id from prisme.assertion a where a.id = old.assertion_id
   )
   and not exists (
     select 1 from prisme.citation c where c.assertion_id = old.assertion_id
   );
  return old;
end;
$$;

create trigger citation_supprimee_invalide_synthese
  after delete on prisme.citation
  for each row
  execute function prisme.invalider_synthese_si_orpheline();

-- ─── A4 · UN RATTACHEMENT SOUS LE SEUIL N'EST JAMAIS « CONFIRMÉ » ───────
--
-- La doctrine « en cas de doute, ne pas fusionner » devient une contrainte.
-- Le seuil reste à calibrer sur corpus annoté ; la doctrine, elle, est fixée.

alter table prisme.rattachement
  add constraint rattachement_confirme_exige_confiance
  check (statut <> 'confirme' or confiance >= 0.82);

-- ─── PAS DE REPORT SANS ÉCHÉANCE ────────────────────────────────────────
--
-- Une pile « à lire plus tard » sans date EST la dette informationnelle.
-- Le schéma interdit d'en créer une.

alter table prisme.sujet_suivi
  add constraint report_exige_echeance
  check (nb_reports = 0 or reporte_au is not null);

-- ─── COHÉRENCE DE LA CLÔTURE ────────────────────────────────────────────

alter table prisme.sujet_suivi
  add constraint boucle_exige_date
  check (statut <> 'boucle' or boucle_le is not null);

-- ─── O2 · LA FILE EST BORNÉE À LA CONSTRUCTION ──────────────────────────
--
-- Le budget borne la file au moment où on la remplit, il ne la tronque pas
-- à l'affichage. Vérifié en base pour que ce soit vrai quel que soit le
-- client qui écrit.

create or replace function prisme.verifier_budget_session()
returns trigger
language plpgsql
as $$
declare
  cumul integer;
  budget integer;
begin
  select coalesce(sum(ef.cout_estime_s), 0) into cumul
  from prisme.entree_file ef where ef.session_id = new.session_id;

  select s.budget_declare_s into budget
  from prisme.session s where s.id = new.session_id;

  if cumul > budget then
    raise exception
      'O2 : la file (% s) dépasse le budget déclaré (% s)', cumul, budget
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create constraint trigger file_bornee_par_budget
  after insert or update on prisme.entree_file
  deferrable initially deferred
  for each row
  execute function prisme.verifier_budget_session();
