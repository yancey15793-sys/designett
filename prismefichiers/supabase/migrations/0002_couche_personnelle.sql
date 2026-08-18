-- ════════════════════════════════════════════════════════════════════════
-- 0002 — COUCHE PERSONNELLE
--
-- Décision A1, versant utilisateur : une projection légère par-dessus le
-- corpus mutualisé. C'est le seul coût qui croît avec la base installée.
-- ════════════════════════════════════════════════════════════════════════

create table prisme.profil (
  id                uuid primary key references auth.users(id) on delete cascade,
  budget_defaut_s   integer not null default 600,
  plafond_dette_j   integer not null default 14,
  -- Notifications vides par défaut (principe 9 — le défaut doit être calme).
  notifications     jsonb not null default '{}'::jsonb,
  cree_le           timestamptz not null default now()
);

create table prisme.abonnement (
  id             uuid primary key default gen_random_uuid(),
  utilisateur_id uuid not null references auth.users(id) on delete cascade,
  source_id      uuid not null references prisme.source(id) on delete cascade,
  priorite       smallint not null default 0 check (priorite between 0 and 3),
  silencieux     boolean not null default false,
  modalite_preferee text,
  cree_le        timestamptz not null default now(),
  unique (utilisateur_id, source_id)   -- R10
);
create index abonnement_utilisateur_idx on prisme.abonnement (utilisateur_id);

-- R11 — la relation charnière entre les deux moitiés du modèle.
create table prisme.sujet_suivi (
  id                 uuid primary key default gen_random_uuid(),
  utilisateur_id     uuid not null references auth.users(id) on delete cascade,
  evenement_id       uuid not null references prisme.evenement(id) on delete cascade,
  statut             text not null default 'nouveau'
                       check (statut in ('nouveau','en_cours','boucle','rouvert','ecarte')),
  entre_le           timestamptz not null default now(),
  boucle_le          timestamptz,
  substance_atteinte boolean not null default false,
  temps_consomme_s   integer not null default 0,
  origine            text not null
                       check (origine in ('abonnement','regle','recherche','rappel')),
  -- Il n'existe pas de report sans échéance : une pile sans date EST la
  -- dette informationnelle (boucle 4 §8.1).
  reporte_au         timestamptz,
  nb_reports         smallint not null default 0,
  unique (utilisateur_id, evenement_id)
);
create index sujet_suivi_file_idx
  on prisme.sujet_suivi (utilisateur_id, statut, entre_le);

-- R12 — UN SEUL enregistrement par (utilisateur, item), toutes modalités
-- confondues. Deux progressions sur le même item = bug, pas cas limite.
create table prisme.progression (
  id                 uuid primary key default gen_random_uuid(),
  utilisateur_id     uuid not null references auth.users(id) on delete cascade,
  sujet_suivi_id     uuid not null references prisme.sujet_suivi(id) on delete cascade,
  item_id            uuid not null references prisme.item(id) on delete cascade,
  ancrage_canonique  jsonb not null,
  taux_completion    real not null default 0 check (taux_completion between 0 and 1),
  secondes_actives   integer not null default 0,
  modalite_derniere  text not null,
  appareil           text,
  maj_le             timestamptz not null default now(),
  unique (utilisateur_id, item_id)
);

create table prisme.session (
  id                     uuid primary key default gen_random_uuid(),
  utilisateur_id         uuid not null references auth.users(id) on delete cascade,
  budget_declare_s       integer not null,
  temps_reel_s           integer not null default 0,
  issue                  text check (issue in
                           ('file_vide','budget_epuise','abandon','interrompue')),
  reprise_apres_absence  boolean not null default false,
  ouverte_le             timestamptz not null default now(),
  scellee_le             timestamptz
);
create index session_utilisateur_idx on prisme.session (utilisateur_id, ouverte_le desc);

create table prisme.entree_file (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references prisme.session(id) on delete cascade,
  sujet_suivi_id uuid not null references prisme.sujet_suivi(id) on delete cascade,
  rang           integer not null,
  cout_estime_s  integer not null,
  -- O4 : chaque entrée sait dire pourquoi elle est là. Stocké, pas recalculé,
  -- pour que la justification survive à un changement d'ordonnanceur.
  pourquoi       jsonb not null,
  issue          text check (issue in ('boucle','reporte','ecarte','non_atteint')),
  unique (session_id, rang)
);

create table prisme.regle (
  id             uuid primary key default gen_random_uuid(),
  utilisateur_id uuid not null references auth.users(id) on delete cascade,
  condition      jsonb not null,
  action         jsonb not null,
  -- Le système propose, l'utilisateur valide (pilier 4).
  origine        text not null check (origine in ('utilisateur','proposee_systeme')),
  etat           text not null default 'proposee'
                   check (etat in ('active','proposee','refusee'))
);

create table prisme.annotation (
  id                uuid primary key default gen_random_uuid(),
  utilisateur_id    uuid not null references auth.users(id) on delete cascade,
  item_id           uuid not null references prisme.item(id) on delete restrict,
  ancrage_canonique jsonb not null,
  modalite_capture  text not null,
  extrait           text not null,
  note              text,
  cree_le           timestamptz not null default now()
);
create index annotation_utilisateur_idx on prisme.annotation (utilisateur_id, cree_le desc);

create table prisme.collection (
  id             uuid primary key default gen_random_uuid(),
  utilisateur_id uuid not null references auth.users(id) on delete cascade,
  nom            text not null
);

create table prisme.annotation_collection (
  annotation_id uuid not null references prisme.annotation(id) on delete cascade,
  collection_id uuid not null references prisme.collection(id) on delete cascade,
  primary key (annotation_id, collection_id)
);

create table prisme.rappel (
  id             uuid primary key default gen_random_uuid(),
  annotation_id  uuid not null references prisme.annotation(id) on delete cascade,
  remonte_le     timestamptz not null,
  intervalle_j   integer not null default 30
);

create table prisme.connecteur_sortie (
  id             uuid primary key default gen_random_uuid(),
  utilisateur_id uuid not null references auth.users(id) on delete cascade,
  cible          text not null check (cible in ('obsidian','notion','markdown','api')),
  etat           text not null default 'actif' check (etat in ('actif','erreur','suspendu')),
  derniere_erreur text,
  derniere_synchro timestamptz,
  unique (utilisateur_id, cible)
);
