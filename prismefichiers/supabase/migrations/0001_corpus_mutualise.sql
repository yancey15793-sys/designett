-- ════════════════════════════════════════════════════════════════════════
-- 0001 — CORPUS MUTUALISÉ
--
-- Décision A1 : le regroupement, la synthèse et le panorama sont calculés
-- UNE FOIS pour tous. Ces tables n'ont pas de colonne utilisateur, et c'est
-- ce qui rend le coût marginal d'un utilisateur supplémentaire négligeable.
--
-- Aucun client n'écrit ici. L'ingestion passe par la clé de service.
-- ════════════════════════════════════════════════════════════════════════

create schema if not exists prisme;

-- ─── Éditeurs et référentiels ───────────────────────────────────────────

create table prisme.editeur (
  id             uuid primary key default gen_random_uuid(),
  nom            text not null,
  pays           text,
  proprietaire   text,
  financement    text,
  cree_le        timestamptz not null default now()
);

create table prisme.referentiel (
  id                uuid primary key default gen_random_uuid(),
  nom               text not null,
  url_methodologie  text not null   -- Principe 4 : contestable, donc citable
);

create table prisme.evaluation_editoriale (
  id             uuid primary key default gen_random_uuid(),
  editeur_id     uuid not null references prisme.editeur(id) on delete cascade,
  referentiel_id uuid not null references prisme.referentiel(id),
  axe            text not null check (axe in ('orientation','factualite','propriete')),
  valeur         text not null,
  -- Ordinal de -3 (pôle froid) à +3 (pôle chaud). Le mapping teinte est
  -- conventionnel et documenté comme tel : jamais rouge/bleu, inversé
  -- entre la France et les États-Unis.
  cran           smallint check (cran between -3 and 3),
  releve_le      date not null,
  unique (editeur_id, referentiel_id, axe, releve_le)
);

-- ─── Sources et items ───────────────────────────────────────────────────

create table prisme.source (
  id             uuid primary key default gen_random_uuid(),
  editeur_id     uuid not null references prisme.editeur(id) on delete restrict,
  nature         text not null check (nature in
                   ('rss','infolettre','podcast','video','surveillance','depot')),
  uri            text not null unique,
  sante          text not null default 'saine'
                   check (sante in ('saine','degradee','rompue')),
  -- Mesure l'amortissement : une source lue par un seul utilisateur porte
  -- un coût non amorti. Instrumenté dès le premier jour (boucle 2 §4.1).
  abonnes_actifs integer not null default 0,
  derniere_collecte timestamptz
);

create table prisme.item (
  id               uuid primary key default gen_random_uuid(),
  source_id        uuid not null references prisme.source(id) on delete restrict,
  editeur_id       uuid not null references prisme.editeur(id) on delete restrict,
  uri_canonique    text not null,
  titre            text not null,
  -- Détection de reprise de dépêche.
  empreinte        text not null,
  publie_le        timestamptz not null,
  langue           text not null default 'fr',
  duree_estimee_s  integer not null default 0,
  unique (source_id, uri_canonique)
);
create index item_empreinte_idx on prisme.item (empreinte);
create index item_publie_le_idx on prisme.item (publie_le desc);

-- R2 : la suppression d'une source NE supprime pas ses items. Un item cité
-- dans une annotation doit survivre au désabonnement.

create table prisme.rendition (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references prisme.item(id) on delete cascade,
  modalite    text not null check (modalite in
                ('texte','audio_natif','audio_synthese','video','transcription')),
  origine     text not null check (origine in ('native','derivee')),
  duree_s     integer,
  pret        boolean not null default true,   -- false = génération en cours
  unique (item_id, modalite)
);

-- A6 — l'entité qui rend « un seul état » réalisable. Sans elle, la
-- continuité multimodale est une promesse creuse.
create table prisme.alignement (
  id                    uuid primary key default gen_random_uuid(),
  rendition_source_id   uuid not null references prisme.rendition(id) on delete cascade,
  rendition_cible_id    uuid not null references prisme.rendition(id) on delete cascade,
  -- [{bloc, decalage, ms}] — projette l'ancrage canonique dans chaque modalité
  table_ancrages        jsonb not null,
  unique (rendition_source_id, rendition_cible_id)
);

-- ─── Événements et rattachements ────────────────────────────────────────

create table prisme.evenement (
  id                uuid primary key default gen_random_uuid(),
  titre_canonique   text not null,
  apparu_le         timestamptz not null default now(),
  dernier_fait_le   timestamptz not null default now(),
  vivacite          text not null default 'chaud'
                      check (vivacite in ('chaud','actif','stabilise','clos'))
);
create index evenement_dernier_fait_idx on prisme.evenement (dernier_fait_le desc);

-- A4 — le lien porte le doute au lieu de le masquer.
create table prisme.rattachement (
  id            uuid primary key default gen_random_uuid(),
  evenement_id  uuid not null references prisme.evenement(id) on delete cascade,
  item_id       uuid not null references prisme.item(id) on delete cascade,
  role          text not null check (role in
                  ('primaire','reprise','analyse','reaction','correction')),
  confiance     real not null check (confiance between 0 and 1),
  statut        text not null default 'candidat'
                  check (statut in ('confirme','candidat','rejete')),
  unique (evenement_id, item_id)
);
create index rattachement_evenement_idx on prisme.rattachement (evenement_id, statut);

create table prisme.jalon (
  id                     uuid primary key default gen_random_uuid(),
  evenement_id           uuid not null references prisme.evenement(id) on delete cascade,
  survenu_le             timestamptz not null,
  libelle                text not null,
  declenche_reouverture  boolean not null default false
);

-- ─── Synthèses, assertions, citations ───────────────────────────────────

create table prisme.synthese (
  id             uuid primary key default gen_random_uuid(),
  evenement_id   uuid not null references prisme.evenement(id) on delete cascade,
  duree_cible    text not null check (duree_cible in ('30s','3min','integral')),
  registre       text not null check (registre in ('neutre','contradictoire','vulgarise')),
  langue         text not null default 'fr',
  version_modele text not null,
  generee_le     timestamptz not null default now(),
  -- Basculé à false quand une citation devient irrésolvable. Une synthèse
  -- non servable n'est pas servie dégradée : elle n'est pas servie.
  servable       boolean not null default true,
  -- R6 : mutualisée par (événement, durée, registre, langue).
  unique (evenement_id, duree_cible, registre, langue)
);

create table prisme.assertion (
  id           uuid primary key default gen_random_uuid(),
  synthese_id  uuid not null references prisme.synthese(id) on delete cascade,
  rang         integer not null,
  enonce       text not null,
  unique (synthese_id, rang)
);

create table prisme.citation (
  id            uuid primary key default gen_random_uuid(),
  assertion_id  uuid not null references prisme.assertion(id) on delete cascade,
  item_id       uuid not null references prisme.item(id) on delete restrict,
  -- Ancrage canonique : {bloc, decalage}
  ancrage       jsonb not null
);
create index citation_assertion_idx on prisme.citation (assertion_id);
create index citation_item_idx on prisme.citation (item_id);

-- ─── Couverture ─────────────────────────────────────────────────────────

create table prisme.couverture (
  evenement_id             uuid primary key references prisme.evenement(id) on delete cascade,
  nb_editeurs              integer not null,
  repartition_orientations jsonb not null,
  repartition_proprietaires jsonb not null,
  editeurs_ids             uuid[] not null,
  calculee_le              timestamptz not null default now()
);
