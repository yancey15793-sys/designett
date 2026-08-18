# Prisme — produit de référence de la consommation d'information moderne

Dépôt produit et application. Sept boucles : la thèse d'abord, la forme ensuite, le code en dernier — chaque boucle contraignant la suivante.

## État

**→ [Dossier Prisme](docs/dossier-prisme.html) — les sept boucles en une seule page.**

| Boucle | Livrable | Statut |
|---|---|---|
| **1** | [Socle stratégique](docs/produit/strategie-v1.md) — Mission, Vision, Personas, JTBD, Matrice concurrentielle, North Star Metric, Piliers fonctionnels, Principes produit | ✅ Livré |
| **2** | [Architecture du produit](docs/produit/architecture-v1.md) — Sitemap, Navigation principale et secondaire, Modèle de données, Entités, Relations | ✅ Livré |
| **3** | [Système de design](docs/design/systeme-v1.md) — Couleurs, typographie, espacement, composants, cartes, listes, lecteur audio, widgets · [jetons](docs/design/tokens.css) | ✅ Livré |
| **4** | [Parcours utilisateur](docs/produit/parcours-v1.md) — découverte, ajout d'une source, lecture, écoute, sauvegarde, partage | ✅ Livré |
| **5** | [Wireframes](docs/design/wireframes-v1.html) — Home, Feed, Topic, Podcast, Article, Discover, Library (HTML seul, basse fidélité) | ✅ Livré |
| **6** | [UI haute fidélité](docs/design/ui-haute-fidelite-v1.html) — les sept écrans en interface premium, HTML + CSS, réactif | ✅ Livré |
| **7** | [Application](docs/architecture-frontend.md) — Next.js 16, TypeScript, Tailwind 4, shadcn/ui, Supabase · **ordonnanceur tranché** | ✅ Livré |
| 8 | Authentification · lecteur audio · détail d'un Sujet · calibrage des seuils | ⏳ À ouvrir |

## La thèse en un paragraphe

Le marché a produit cinq excellents produits qui résolvent chacun **un quart** du problème : Inoreader la souveraineté des sources, Particle la synthèse multi-angles, Ground News la transparence du paysage médiatique, Readwise Reader la mémoire, Pocket Casts la consommation différée. Aucun n'a résolu les quatre, alors que c'est le même problème. Tous sont optimisés pour l'accumulation, aucun pour la clôture — ce qui produit ce que nous appelons la **dette informationnelle** : l'écart entre ce qu'on a décidé de suivre et ce qu'on a réellement compris. C'est elle qui tue la rétention, et c'est elle que nous facturons pour réduire.

## Les cinq décisions structurantes de la boucle 1

1. **L'unité d'information est l'événement**, pas le flux ni l'article.
2. **« Fini » est une fonctionnalité.** Un produit d'information sans fond a échoué.
3. **North Star : Sujets Bouclés par Utilisateur Actif et par Semaine** — avec le temps médian par sujet bouclé en garde-fou, qui doit *baisser*.
4. **Le temps passé est un coût, jamais une recette.** Pas de publicité, pas de DAU comme objectif.
5. **Anti-persona assumé : le consommateur de défilement passif.** Toute décision qui le rendrait heureux est refusée.

## Les sept décisions d'architecture de la boucle 2

1. **L'Événement est global, le Sujet suivi est personnel** — le coût lourd est mutualisé, la couche par utilisateur est légère.
2. **L'Item n'est jamais une destination de premier rang** — aucune vue « tous les articles ».
3. **La file est bornée par le budget, pas par le stock.**
4. **Un regroupement non confirmé n'est jamais présenté comme fusionné.**
5. **Aucune Assertion sans Citation** — contrainte de schéma, pas consigne de rédaction.
6. **Une position canonique unique**, projetée dans chaque modalité.
7. **Aucun compteur de non-lus** — sauf le reste de la session en cours, qui décroît vers zéro.

## Les quatre règles du système de design de la boucle 3

1. **La couleur n'est jamais décorative** — elle porte une information. Un seul accent coloré par vue.
2. **L'action primaire est de l'encre, pas une teinte.** La teinte est réservée au focus et à la progression de session.
3. **L'incertitude est une texture, jamais une couleur** — un rapprochement non confirmé se hachure, il ne s'alerte pas.
4. **Aucun nombre qui monte.** Le seul compteur du produit décroît vers zéro.

Une seule échelle, **deux densités** : `ample` pour la traversée (Pinterest), `dense` pour l'inventaire (Linear). Apple Podcasts gouverne la couche temporelle, orthogonale aux deux.

## Les deux décisions de la boucle 4

Deux parcours demandés heurtaient de front des interdits posés plus tôt. Les traiter frontalement a produit les deux meilleures décisions de la boucle.

1. **Il n'y a pas de pile « à lire plus tard ».** Reporter oblige à choisir quand. Une pile sans échéance est la dette informationnelle sous sa forme la plus pure — le mécanisme même que le produit prétend supprimer.
2. **La synthèse ne circule jamais comme texte autonome.** Trois objets sont partageables — le lien source, la citation tracée, la carte de sujet — et la synthèse ne l'est qu'en lien vers Prisme, où vivent ses citations. Ce refus coûte de la viralité, et c'est pour cela qu'il fallait le trancher avant que la pression de croissance ne le tranche à notre place.

## Lancer l'application

```bash
npm install && npm run dev     # démarre sur les fixtures, sans Supabase
npm run typecheck && npm run test && npm run build
```

Sans variables Supabase, l'application bascule sur le dépôt de démonstration — un écran reste rendu, donc revu, même sans infrastructure.

## Comment se lit ce dépôt

Chaque boucle produit un document versionné et daté. Une boucle ne réécrit pas la précédente : elle la contredit explicitement quand elle a de bonnes raisons de le faire. Les questions ouvertes d'une boucle sont les entrées de la suivante — voir la section *« Ce que cette boucle ne tranche pas »* en fin de document.
