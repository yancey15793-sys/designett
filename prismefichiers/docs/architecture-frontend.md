# Architecture front — v1

**Prisme — boucle 7**

> **Stack** : Next.js 16 (App Router) · TypeScript strict · Tailwind 4 · composants shadcn/ui vendus · Supabase (Postgres + RLS).
> **État vérifié** : `tsc --noEmit` ✅ · `vitest run` 24/24 ✅ · `next build` ✅ · six routes rendues en 200.

---

## 1. Les sept décisions

| # | Décision | Ce qu'elle évite |
|---|---|---|
| **D1** | **La frontière A1 est la frontière de sécurité.** Corpus mutualisé : lecture pour tout authentifié, écriture réservée à la clé de service. Couche personnelle : tout cloisonné par `auth.uid()`. | Que la séparation « mutualisé / personnel » ne vive que dans les intentions. En RLS, elle est vérifiée à chaque requête. |
| **D2** | **Le domaine est pur.** `lib/domaine/` n'importe ni React, ni Next, ni Supabase. | Que les règles métier deviennent inatteignables sans monter un rendu ou une base. C'est ce qui rend les 24 tests instantanés. |
| **D3** | **R8 est une contrainte de base, pas du code applicatif.** Trigger différé : une assertion sans citation fait échouer le COMMIT. | Qu'un principe saute au premier sprint sous pression. Ce que le schéma refuse de stocker, aucune couche supérieure ne peut le diffuser. |
| **D4** | **Les transitions de statut passent par des RPC `security definer`**, jamais par un `UPDATE` client. | Que la North Star soit calculée sur un état que le client a écrit lui-même. |
| **D5** | **L'ordonnanceur est une interface, et `pourquoi` est un champ obligatoire du type de retour.** | Qu'on livre un ordre inexplicable. Un ordonnanceur incapable de se justifier **ne compile pas**. |
| **D6** | **Les jetons de la boucle 3 sont le thème Tailwind**, via `@theme` — Tailwind 4 étant piloté par le CSS, il n'y a aucune duplication entre un fichier de config et un fichier de design. | La dérive entre le système de design documenté et celui réellement appliqué. |
| **D7** | **Les règles produit sont dans les signatures.** `JaugeSession` n'accepte que `restantS` ; aucun composant n'expose de prop `badge`. | Qu'une règle comme « aucun nombre qui monte » repose sur la vigilance en revue de code. |

---

## 2. Arborescence

```
app/
  (app)/
    layout.tsx              coquille de navigation — 4 destinations, ordre figé
    aujourdhui/page.tsx     la file finie · Server Component
    sujets/page.tsx         l'inventaire · pagination explicite
    bibliotheque/page.tsx   la mémoire
    sources/page.tsx        la souveraineté
  globals.css               jetons → @theme Tailwind
components/
  ui/                       primitives shadcn/ui, vendues dans le dépôt
  prisme/                   composants de domaine
lib/
  domaine/                  ── PUR ── aucune dépendance framework
    types.ts                modèle de la boucle 2
    nsm.ts                  substance · clôture · fraîcheur
    ordonnanceur.ts         contrat O1–O5 + stratégie v0
    panorama.ts             angle mort · pluralité · plafond de séries
    synthese.ts             servabilité (R8) · seuil de fusion (A4)
    domaine.test.ts         24 tests
  donnees/
    depot.ts                interface + sélection d'implémentation
    depot-demo.ts           fixtures — l'app tourne sans infrastructure
    depot-supabase.ts       mapping snake_case → domaine, ici et nulle part ailleurs
  supabase/serveur.ts       client SSR, clé anonyme uniquement
supabase/migrations/
  0001_corpus_mutualise.sql
  0002_couche_personnelle.sql
  0003_contraintes_integrite.sql
  0004_rls_et_rpc.sql
```

**La règle de dépendance** : `app` → `components` → `lib/donnees` → `lib/domaine`. Jamais l'inverse. `lib/domaine` ne dépend de rien.

---

## 3. L'ordonnanceur — la question ouverte depuis la boucle 2

Elle est tranchée de la seule manière honnête : une **interface qui impose le contrat**, plus une stratégie v0 explicite et remplaçable.

```ts
export interface EntreeFile {
  readonly sujetId: string;
  readonly rang: number;
  readonly coutEstimeS: number;
  readonly pourquoi: Justification;   // O4 — obligatoire
}
```

**O4 n'est pas une convention d'équipe.** `pourquoi` étant requis, un ordonnanceur muet ne passe pas le compilateur. Un ordre inexplicable serait un algorithme opaque — et le produit vend exactement l'inverse.

**Facteurs de la v0**, par poids décroissant : report échu (une promesse faite à l'utilisateur) · réouverture (le monde a changé) · dette (évite la famine) · fraîcheur du dernier fait · priorité d'abonnement.

**Explicitement absents** (O5) : popularité du sujet, temps de session prédit, taux de clic. Aucun signal d'engagement n'entre dans le classement.

**Vérifié à l'exécution**, sur les fixtures : budget 600 s, six sujets éligibles pour 840 s de contenu. La file retenue fait exactement 600 s ; « Loi de programmation énergétique » (240 s) est écarté et le remplissage **continue** au lieu de s'arrêter — un budget qui laisserait 3 min vides parce que le sujet suivant en coûtait 5 serait un mauvais résultat.

```
1. Semi-conducteurs      « Vous aviez demandé à le revoir aujourd’hui. »
2. Fret ferroviaire      « Un fait nouveau est tombé sur un sujet que vous aviez bouclé. »
3. Plafond d’émissions   « Le sujet bouge en ce moment. »
4. Marché obligataire    « En attente depuis 3 jours. »
5. Accord céréalier      rapprochement non confirmé
```

Les poids sont des **hypothèses à calibrer**, pas des faits. L'interface rend leur remplacement local à un fichier.

---

## 4. Ce que le schéma interdit

| Invariant | Mécanisme |
|---|---|
| Aucune assertion sans citation (R8) | `constraint trigger ... deferrable initially deferred` |
| Retirer une citation invalide la synthèse entière | Trigger `after delete` → `servable = false` |
| Un rattachement `confirmé` exige une confiance ≥ 0,82 (A4) | `check` |
| Aucun report sans échéance | `check (nb_reports = 0 or reporte_au is not null)` |
| La file ne dépasse jamais le budget (O2) | Trigger différé sur `entree_file` |
| Une progression par (utilisateur, item), toutes modalités (R12) | `unique` |
| Un abonnement par (utilisateur, source) (R10) | `unique` |

Clore sans substance n'écrit pas `bouclé` mais `écarté` — arbitré dans `prisme.boucler_sujet()`, côté serveur. Le geste utilisateur est identique ; l'enregistrement diffère.

---

## 5. Ce qui n'est pas fait

Honnêteté sur le périmètre réellement livré.

| Absent | Pourquoi |
|---|---|
| **Authentification** | Les pages utilisent un identifiant de démonstration. Le middleware de session et les écrans de connexion restent à câbler. |
| **Lecteur audio** | Le composant le plus travaillé de la boucle 3 n'est pas implémenté. Il exige la table d'alignement peuplée, une synthèse vocale et l'API Media Session — un chantier à part entière. |
| **Détail d'un Sujet, Article, Panorama complet** | Seules `Aujourd'hui` et `Sujets` sont des vues fonctionnelles. Les autres destinations existent, sont libellées et annoncent leur état. |
| **Ingestion** | Hors de cette application, par conception : c'est le seul chemin d'écriture vers le corpus mutualisé, et il utilise la clé de service. |
| **Migrations exécutées** | Le SQL est écrit et relu, **jamais appliqué** — aucune instance Supabase n'est provisionnée dans cet environnement. Les triggers et politiques sont à valider sur une base réelle avant d'y compter. |
| **Calcul du coût estimé** | Fixé à 120 s dans l'implémentation Supabase, en attendant d'être branché sur les renditions. Marqué provisoire dans le code, pas dissimulé. |

---

## 6. Vérification

```bash
npm install
npm run typecheck   # tsc --noEmit, strict + noUncheckedIndexedAccess
npm run test        # 24 tests de domaine
npm run build       # next build
npm run dev         # démarre sur les fixtures, sans Supabase
```

Sans `NEXT_PUBLIC_SUPABASE_URL`, l'application bascule sur le dépôt de démonstration. Ce n'est pas un mode dégradé de confort : c'est ce qui garantit qu'un écran reste rendu — donc revu — même quand l'infrastructure n'est pas provisionnée.
