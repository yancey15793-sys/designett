# Stratégie produit — v1

**Nom de code : « Prisme »**
*Un prisme ne crée pas la lumière. Il en révèle la structure.*

> **Statut** : boucle 1 / socle stratégique.
> **Périmètre** : Mission, Vision, Personas, Jobs To Be Done, Matrice concurrentielle, North Star Metric, Piliers fonctionnels, Principes produit.
> **Hors périmètre volontaire** : aucun écran, aucun flux d'interface, aucune architecture technique. La forme se décide après que la thèse tient.
> **Équipe** : Product Manager · UX Researcher · Information Architect · Competitive Analyst.

---

## 0. Le constat qui justifie ce produit

Trois faits structurent le marché en 2026.

**Fait 1 — L'évitement de l'information est devenu majoritaire chez les publics engagés.**
42 % des personnes interrogées déclarent éviter l'actualité souvent ou parfois — contre 29 % en 2017. Au Royaume-Uni, 50 %. Aux États-Unis, 45 %. La cause dominante n'est pas le désintérêt : c'est la **surcharge émotionnelle** et l'impression que l'effort fourni ne produit aucune compréhension. *(Reuters Institute, Digital News Report 2026.)*

**Fait 2 — Les outils existants ont chacun résolu un quart du problème.**
Inoreader a résolu la **souveraineté des sources**. Particle et Ground News ont résolu la **résolution en événements** et la **transparence du paysage médiatique**. Readwise Reader a résolu la **transformation de la lecture en mémoire**. Pocket Casts a résolu la **consommation différée** — file d'attente, reprise, synchronisation, vitesse. Aucun n'a résolu les quatre. Et les quatre problèmes sont le même problème.

**Fait 3 — La friction ne se situe plus à l'entrée, elle se situe à la sortie.**
Il n'a jamais été aussi facile de collecter de l'information. Il n'a jamais été aussi difficile d'en **finir** avec un sujet. Tous les produits de la catégorie sont optimisés pour l'accumulation ; aucun n'est optimisé pour la clôture. Le résultat porte un nom, et c'est le concept central de ce document :

> ### La dette informationnelle
> L'écart entre ce qu'un utilisateur a décidé de suivre et ce qu'il a réellement compris.
> Elle est mesurable, elle s'accumule avec intérêts, et **c'est elle qui tue la rétention** — pas le manque de contenu.

Chaque produit de la catégorie facture un abonnement pour **augmenter** cette dette. Aucun ne facture pour la réduire. C'est l'espace.

---

## 1. Mission

> **Transformer le flux de l'information en compréhension finie.**
>
> Nous donnons aux personnes qui ont besoin de comprendre le monde la capacité de **posséder leurs sources**, de **voir la structure réelle de la couverture** d'un événement, et de **terminer** — avec la certitude d'avoir fait le tour, et sans avoir payé cette certitude en heures perdues.

**Ce que la mission engage, phrase par phrase.**

| Fragment | Engagement opposable |
|---|---|
| *« flux → compréhension »* | L'unité de valeur n'est pas l'article lu. C'est le sujet compris. |
| *« finie »* | Le produit doit pouvoir être **terminé**. Un produit sans fond est un produit qui a échoué. |
| *« posséder leurs sources »* | Pas d'algorithme opaque en position d'autorité. Entrée et sortie libres (OPML, export, API). |
| *« structure réelle de la couverture »* | Nous montrons qui couvre, qui ne couvre pas, depuis quel angle, avec quelle propriété capitalistique. Nous ne désignons jamais le vrai. |
| *« sans payer en heures perdues »* | Le temps passé dans le produit est un **coût** que nous devons faire baisser. Jamais une recette. |

---

## 2. Vision

### Vision à 5 ans

> **En 2031, « suivre un sujet » sera une action aussi nette qu'« archiver un e-mail ».**
>
> Une personne déclarera ce qui compte pour elle. Le système ira chercher la matière partout où elle vit — presse, newsletters, podcasts, vidéo, rapports, pages web sans flux — la fondra en événements plutôt qu'en articles, en exposera le paysage éditorial complet, et la restituera dans la modalité et la durée disponibles. À la fin, la file sera **vide**, et ce qui a été compris sera **retrouvable**.

### Ce qui aura changé dans le monde si nous réussissons

1. **La duplication aura disparu de l'expérience.** Lire un événement, ce sera lire *un* objet, pas quarante reprises de dépêche.
2. **« Je n'ai pas le temps de m'informer » cessera d'être vrai.** Sept minutes bien dépensées battront quarante minutes de défilement, et l'utilisateur le saura parce que le produit le lui montre.
3. **L'angle mort deviendra visible par défaut.** Savoir *ce qu'on ne voit pas* sera une fonctionnalité de base, pas un abonnement militant.
4. **La consommation produira du capital.** Ce qu'on a compris en mars sera mobilisable en novembre, sans dépendre de la mémoire humaine.
5. **La sobriété deviendra un argument commercial.** Nous voulons être le premier produit d'information dont le succès se démontre par la **baisse** du temps passé à usage constant.

### Ce que la vision refuse explicitement

- Devenir un réseau social. Aucun flux public, aucun compteur de vues, aucune économie du commentaire.
- Devenir un média. Nous ne produisons pas d'éditorial ; nous ne remplaçons pas la source, nous y ramenons.
- Devenir un outil de veille d'entreprise (Meltwater, Cision). Marché adjacent, acheteur différent, produit différent. Peut-être plus tard, jamais en v1.

---

## 3. Personas

*Note du UX Researcher : quatre personas primaires, un persona secondaire, deux anti-personas. Les anti-personas comptent autant que les autres — ce sont eux qui rendent les arbitrages possibles.*

### P1 — Nadia, 34 ans — l'analyste sous obligation de couverture
**Analyste risque-pays, cabinet de conseil, Paris.**

| | |
|---|---|
| **Contexte** | 180 sources actives, 5 zones géographiques, 3 langues. Sa production dépend de son intake. |
| **Déclencheur quotidien** | 7h15, avant la revue d'équipe. Deuxième passe à 18h. |
| **Ce qui la fait échouer aujourd'hui** | Inoreader lui donne le contrôle mais lui rend 2 400 items non lus ; elle « travaille pour son lecteur RSS ». Elle a raté un signal faible sur un dossier suivi — pas par manque de source, mais par noyade. |
| **Critère de succès** | *« Je peux affirmer devant un client que j'ai fait le tour d'un sujet, et le prouver. »* |
| **Signal de churn** | Elle rouvre Google Actualités « pour vérifier ». La confiance dans l'exhaustivité est rompue. |
| **Disposition à payer** | Élevée (15–30 €/mois). C'est un outil professionnel, pas un loisir. |
| **Ce qu'elle ne veut surtout pas** | Qu'un résumé décide à sa place de ce qui est important. Elle veut le tri, pas le jugement. |

### P2 — Marc, 45 ans — le citoyen saturé
**Chef de projet, deux enfants, Lyon. Représente les 42 %.**

| | |
|---|---|
| **Contexte** | Se considérait « bien informé » il y a dix ans. A désinstallé Twitter/X en 2023. Se sent à la fois inondé et ignorant. |
| **Déclencheur** | Un dîner où il n'a rien pu dire sur un sujet dont tout le monde parlait. Honte sociale, pas curiosité. |
| **Ce qui le fait échouer aujourd'hui** | Il n'a pas un problème d'accès, il a un problème de **coût émotionnel**. Chaque tentative de rattrapage le renvoie vers un mur anxiogène et infini, donc il n'essaie plus. |
| **Critère de succès** | *« 10 minutes par jour, et je ne suis plus le dernier au courant. »* |
| **Signal de churn** | Deux jours d'absence produisent une file de 60 éléments. Il ne revient pas. **Le pardon de l'absence est une fonctionnalité de survie pour ce persona.** |
| **Disposition à payer** | Moyenne (5–8 €/mois), mais volume très supérieur et bouche-à-oreille décisif. |
| **Ce qu'il ne veut surtout pas** | Se sentir jugé sur ce qu'il n'a pas lu. Aucun badge rouge, aucune série à entretenir, aucune culpabilisation. |

### P3 — Inès, 29 ans — la curatrice-productrice
**Autrice d'une newsletter (11 000 abonnés) + podcast hebdomadaire.**

| | |
|---|---|
| **Contexte** | Sa consommation *est* sa matière première. Lit pour publier. Cite, recoupe, archive. |
| **Déclencheur** | Cycle de production hebdomadaire : collecte J1–J4, écriture J5. |
| **Ce qui la fait échouer aujourd'hui** | Chaîne cassée entre 4 outils : Feedly pour découvrir, Readwise pour annoter, Notion pour rédiger, navigateur pour retrouver la source exacte. Elle perd un temps considérable à **retrouver où elle a lu quelque chose**. |
| **Critère de succès** | *« Du signal repéré à la citation sourcée et vérifiée, sans copier-coller. »* |
| **Signal de churn** | Un export raté, une citation dont l'URL ne remonte pas. La confiance de traçabilité est binaire. |
| **Disposition à payer** | Élevée (outil de production, déductible). |
| **Ce qu'elle ne veut surtout pas** | Un résumé IA sans attribution ligne à ligne. Un contenu orphelin est inutilisable pour elle — pire, c'est un risque professionnel. |

### P4 — Tomás, 41 ans — le bâtisseur de savoir
**Ingénieur, pratique PKM depuis 6 ans (Obsidian). Persona historique de Readwise.**

| | |
|---|---|
| **Contexte** | Ne suit pas l'actualité chaude. Suit 25 domaines de fond sur des horizons longs. Mélange articles, PDF, rapports, transcriptions. |
| **Déclencheur** | Pas quotidien : par projet. Une question arrive, elle ouvre une campagne de lecture de 3 semaines. |
| **Ce qui le fait échouer aujourd'hui** | Ses outils traitent chaque document comme neuf. Rien ne lui dit *« tu as déjà lu trois choses là-dessus en 2024, voici ce que tu en avais retenu »*. |
| **Critère de succès** | *« Ce que je lis aujourd'hui se connecte à ce que je savais déjà. »* |
| **Signal de churn** | Verrouillage des données. Il partira le jour où l'export se dégrade. |
| **Disposition à payer** | Élevée et durable — mais exige la portabilité comme condition d'entrée. |

### P5 — *(secondaire)* Amira, 22 ans — l'étudiante en quête de fiabilité
Consomme surtout en audio et en vidéo, en déplacement. Défiante envers toutes les sources, y compris celles qui la confortent. Cherche moins « la vérité » que **la carte des désaccords**. Faible disposition à payer, forte valeur de prescription. Elle valide notre thèse de transparence : si le pilier 3 ne la convainc pas, il est décoratif.

### Anti-persona A — le consommateur de défilement passif
Cherche un flux infini, algorithmique, divertissant, sans effort de configuration. **Nous ne le servons pas.** Toute décision produit qui le rendrait heureux dégraderait les quatre personas primaires. C'est le test de cohérence le plus utile de ce document.

### Anti-persona B — l'acheteur de veille d'entreprise
Achète des sièges, des SLA, des rapports PDF de marque blanche et de la conformité. Marché réel, dix fois plus rentable par compte, et **piège stratégique** : il tire le produit vers la complétude exhaustive et le reporting, c'est-à-dire vers l'exact inverse de « finie ».

---

## 4. Jobs To Be Done

*Note du Product Manager : formulés en « Quand… je veux… afin que… », puis pondérés par l'analyse des forces. Un job sans force motrice identifiée est une hypothèse, pas un job.*

### Job principal (le job d'embauche)

> **Quand** je réalise que je ne comprends plus un sujet qui me concerne,
> **je veux** reconstruire une compréhension complète en un temps que j'ai décidé à l'avance,
> **afin de** pouvoir passer à autre chose sans arrière-pensée.

Les six mots qui portent la stratégie : ***un temps que j'ai décidé à l'avance***. Tous les concurrents laissent le contenu décider de la durée. Nous laissons l'utilisateur décider de la durée, et nous adaptons la synthèse.

### Jobs fonctionnels

| # | Job | Persona | Défaillance actuelle du marché |
|---|---|---|---|
| F1 | **Quand** je m'abonne à une source, **je veux** qu'elle entre dans un système que je contrôle, **afin de** ne pas dépendre d'une plateforme pour la revoir. | P1, P4 | Résolu (Inoreader). À égaler, pas à réinventer. |
| F2 | **Quand** 40 médias couvrent le même événement, **je veux** un objet unique, **afin de** ne pas payer 40 fois le prix d'attention de la même information. | Tous | Résolu côté agrégateurs fermés (Particle), **jamais sur des sources possédées**. |
| F3 | **Quand** un sujet est clivant, **je veux** voir qui le couvre, qui l'ignore, et depuis quel intérêt, **afin de** situer ce que je lis. | P2, P3, P5 | Résolu (Ground News) — mais en silo, sur *leur* corpus, pas sur le mien. |
| F4 | **Quand** je n'ai que mes mains occupées, **je veux** écouter ce que j'aurais lu, **afin de** ne pas perdre le créneau. | P2, P5 | **Non résolu.** Pocket Casts le fait parfaitement pour le podcast uniquement. |
| F5 | **Quand** j'ai compris quelque chose, **je veux** que ça reste attrapable dans un an, **afin de** ne pas relire le même sujet trois fois. | P3, P4 | Résolu (Readwise) — mais déconnecté de l'actualité vivante. |
| F6 | **Quand** je m'absente trois jours, **je veux** revenir à un état gérable, **afin de** ne pas abandonner l'outil. | P2 surtout | **Non résolu par personne.** Le marché entier punit l'absence. |
| F7 | **Quand** un signal faible apparaît sur un dossier suivi, **je veux** être prévenu, sinon rien, **afin de** faire confiance au silence. | P1 | Partiellement résolu (règles Inoreader), mais avec un coût de configuration prohibitif. |

### Jobs émotionnels

| # | Job | Enjeu |
|---|---|---|
| E1 | **Quand** je termine ma session, **je veux** ressentir de la clôture et non de la culpabilité, **afin de** revenir demain sans appréhension. | Détermine la rétention à long terme davantage que n'importe quelle fonctionnalité. |
| E2 | **Quand** je m'informe sur un sujet lourd, **je veux** garder le contrôle de l'intensité, **afin de** rester informé sans me faire abîmer. | Le levier direct sur les 42 % d'évitement. |
| E3 | **Quand** je ne lis pas quelque chose, **je veux** que ce soit un choix conscient, **afin de** ne pas vivre dans le soupçon de rater l'essentiel. | Le soupçon (« et si j'avais raté ? ») est le vrai concurrent, plus que Feedly. |

### Jobs sociaux

| # | Job | Enjeu |
|---|---|---|
| S1 | **Quand** un sujet arrive en conversation, **je veux** pouvoir contribuer avec substance, **afin d'** être crédible dans mon milieu. | Moteur d'acquisition de P2. |
| S2 | **Quand** je transmets une information, **je veux** pouvoir montrer d'où elle vient, **afin de** ne pas engager ma réputation à l'aveugle. | Moteur de P1 et P3 ; interdit tout résumé non attribué. |

### Analyse des forces (Push / Pull / Anxiété / Habitude)

| Force | Contenu | Implication produit |
|---|---|---|
| **Poussée** (ce qui fait quitter la situation actuelle) | Épuisement, sentiment d'être mal informé malgré l'effort, honte sociale, retard professionnel. | **Forte.** Ne pas la sur-vendre : elle existe déjà, il faut la nommer, pas la fabriquer. |
| **Attraction** (ce qui attire vers nous) | « Le tour d'un sujet, en un temps que je choisis, avec la carte de qui dit quoi. » | **Forte mais abstraite.** Doit se démontrer en moins de 5 minutes, sans configuration préalable. |
| **Anxiété** (ce qui freine l'adoption) | Coût de mise en place ; peur d'un résumé IA qui trahit ; peur de rater ce que le système écarte ; N-ième abonnement. | **Le principal risque du projet.** L'onboarding doit produire de la valeur *avant* toute configuration, et le système doit toujours pouvoir montrer ce qu'il a écarté et pourquoi. |
| **Habitude** (ce qui retient dans l'existant) | 12 ans d'OPML ; annotations Readwise ; réflexe Instagram/YouTube pour l'actu. | Import sans friction et **export permanent** transforment cette force en argument de vente. |

---

## 5. Matrice concurrentielle

*Note du Competitive Analyst : données vérifiées en août 2026 (sources en fin de document). Les prix bougent vite — à revalider à chaque boucle. Les jugements de faiblesse portent sur la **structure** du produit, pas sur sa qualité d'exécution : les cinq références citées sont toutes excellemment exécutées.*

### 5.1 Carte de positionnement

**Axe horizontal — l'unité d'information traitée :** de la **source** (je gère des abonnements) à l'**événement** (je gère des sujets).
**Axe vertical — la promesse :** de **être au courant** (couverture, vitesse) à **comprendre et retenir** (profondeur, mémoire).

```
                    COMPRENDRE & RETENIR
                             ▲
                             │
        Readwise Reader ●    │
        (document, mémoire)  │        ◆ PRISME
                             │        (cible)
                             │
                             │    ● Ground News
                             │      (transparence
                             │       du paysage)
     SOURCE ────────────────┼──────────────────► ÉVÉNEMENT
                             │
        ● Inoreader          │    ● Particle
          (contrôle,         │      (synthèse IA
           règles, volume)   │       multi-angles)
                             │
        ● Pocket Casts       │    ● Apple News / Discover
          (audio, file,      │      (algorithmique, zéro contrôle)
           reprise)          │
                             ▼
                        ÊTRE AU COURANT
```

**Le quadrant haut-droit est vide** — et il n'est pas vide par hasard : l'atteindre suppose de tenir simultanément l'ingestion souveraine (difficile, peu gratifiant) et la résolution en événements (coûteuse en calcul). Chaque acteur a rationnellement choisi un côté. Notre pari est que l'utilisateur, lui, n'a jamais voulu choisir.

### 5.2 Matrice de capacités

| Capacité | Inoreader | Particle | Ground News | Readwise Reader | Pocket Casts | **Prisme (cible)** |
|---|---|---|---|---|---|---|
| **Unité d'information** | Flux / article | Story (événement) | Story (événement) | Document | Épisode | **Événement + document** |
| **Sources possédées par l'utilisateur** | ✅ RSS, newsletters, flux web, réseaux | ❌ corpus fermé | ❌ corpus fermé | ✅ RSS, newsletters, PDF, EPUB, YouTube, X | ✅ RSS podcast | ✅ **tout, y compris audio & vidéo** |
| **Déduplication en événements** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ **sur les sources de l'utilisateur** |
| **Angles multiples / pluralité** | ❌ | ✅ (*Opposite Sides*) | ✅ (référence du marché) | ❌ | — | ✅ |
| **Propriété capitalistique & factualité** | ❌ | partiel | ✅ (le différenciateur) | ❌ | — | ✅ |
| **Angles morts de couverture** | ❌ | ❌ | ✅ (*Blindspot*) | ❌ | — | ✅ **appliqué à mes sources** |
| **Continuité texte ↔ audio (même objet, même position)** | ❌ | partiel (clips de podcast) | ❌ | partiel (TTS) | ✅ audio seul | ✅ **fondamental** |
| **Annotations, mémoire, remontée différée** | ❌ | ❌ | ❌ | ✅ (référence du marché) | signets | ✅ |
| **Règles & automatisation du tri** | ✅ (référence du marché) | ❌ | ❌ | partiel | filtres | ✅ **sans coût de configuration** |
| **File finie / notion de « terminé »** | ❌ | ❌ | ❌ | ❌ | ✅ (*Up Next*) | ✅ **cœur du produit** |
| **Pardon de l'absence** | ❌ | ❌ | ❌ | ❌ | partiel | ✅ **fonctionnalité nommée** |
| **Portabilité / export** | ✅ OPML, API | ❌ | ❌ | ✅ Obsidian, Notion, Roam, Logseq | ✅ OPML | ✅ **condition d'entrée** |
| **Modèle économique** | Abonnement + équipes | Freemium | Abonnement | Abonnement, pas de palier gratuit | Freemium | **Abonnement, sans publicité** |
| **Prix constaté (août 2026)** | Gratuit (150 flux) · Pro 7,50 $/mois annuel · Équipes dès 44,99 $/mois | Gratuit · Particle+ 2,99 $/mois ou 29,99 $/an | Vantage 99,99 $/an · paliers mobiles dès 0,99 $/mois | 9,99 $/mois annuel · Lite 5,59 $/mois · pas de gratuit | Gratuit · Plus ~5 $/mois | *à arbitrer — voir §5.4* |

### 5.3 Lecture stratégique : ce que chacun tient, et ce qu'il ne peut pas faire

| Acteur | Sa force réelle (à ne pas attaquer frontalement) | Sa limite **structurelle** (notre ouverture) |
|---|---|---|
| **Inoreader** | Profondeur d'ingestion et moteur de règles : dix ans d'avance, impossible à rattraper vite. | L'unité reste le flux. Un produit centré flux **produit mécaniquement** de la dette informationnelle. Le compteur de non-lus est son modèle mental, et c'est le problème de l'utilisateur. |
| **Particle** | Synthèse multi-sources et modulation du registre (*Opposite Sides*, *ELI5*) ; extraction de moments de podcast. | Corpus fermé. L'utilisateur ne possède rien, n'importe rien, n'exporte rien. Aucune profondeur sur la longue traîne (recherche spécialisée, sources locales, publications de niche). |
| **Ground News** | La transparence du paysage médiatique — biais, propriété, factualité, angles morts. Différenciateur défendable et rare. | Mono-fonction, mono-domaine (actualité politique). Ne gère ni newsletters, ni podcasts, ni lecture de fond, ni mémoire. Le prix annuel affiché filtre durement P2. |
| **Readwise Reader** | La chaîne complète lecture → annotation → mémoire → export. Verrou de rétention le plus solide du marché. | Optimisé pour le document, pas pour l'événement. Aucune notion de « ce sujet est traité par 30 médias ». Absence de palier gratuit = plafond d'acquisition. |
| **Pocket Casts** | L'artisanat de la consommation différée : file, reprise, vitesse, synchronisation, hors-ligne. Référence absolue de la catégorie. | Enfermé dans le podcast. C'est **le meilleur modèle mental du marché appliqué au périmètre le plus étroit** — c'est précisément ce que nous voulons généraliser. |
| **Apple News / Google Discover** | Distribution par défaut, coût nul. Notre vrai concurrent en volume. | Zéro contrôle, zéro portabilité, économie publicitaire — donc intérêt structurel opposé au nôtre : ils gagnent quand vous restez, nous quand vous partez. |

### 5.4 Question ouverte pour la boucle suivante

Le positionnement tarifaire est le seul arbitrage majeur que ce document ne tranche pas, parce qu'il dépend d'une décision qui n'est pas encore prise :

- **Option A — professionnelle** (12–15 €/mois, palier gratuit étroit) : suit Readwise, maximise la marge sur P1/P3/P4, **sacrifie P2** — donc sacrifie la mission déclarée sur l'évitement de l'information.
- **Option B — grand public** (5–7 €/mois, palier gratuit généreux) : suit Inoreader/Particle, adresse les 42 %, exige un volume élevé et un coût d'inférence IA maîtrisé par événement plutôt que par utilisateur.

*Recommandation du PM :* **option B avec un palier professionnel au-dessus**. La mission cible P2 ; un produit dont le prix exclut le persona qui justifie la mission est un produit qui a menti sur sa mission. Mais l'économie unitaire de la résolution en événements doit être prouvée avant de s'y engager — c'est le préalable chiffré de la boucle 2.

---

## 6. North Star Metric

### La métrique

> ## Sujets Bouclés par Utilisateur Actif et par Semaine
> **(SBU/sem)**

Un **sujet bouclé** est un sujet suivi qui satisfait **les trois conditions simultanément** :

| Condition | Définition instrumentable | Ce qu'elle empêche |
|---|---|---|
| **1. Substance** | Consommation au-delà du seuil de complétion sur au moins une unité : texte ≥ 70 % du corps ou ≥ 90 s de lecture active ; audio/vidéo ≥ 60 % ou ≥ 3 min ; ou consultation intégrale du panorama multi-sources. | De compter un survol comme une compréhension. |
| **2. Clôture** | Le sujet quitte la file active — archivage explicite, marquage « compris », ou clôture automatique après consommation complète. | De compter l'accumulation comme de la valeur. |
| **3. Fraîcheur** | La clôture intervient ≤ 7 jours après l'entrée du sujet dans la file. Au-delà, ce n'est pas de la valeur livrée : c'est de la dette remboursée en retard. | De maquiller un rattrapage de dette en performance. |

### Pourquoi celle-ci

| Critère d'une bonne North Star | Vérification |
|---|---|
| Reflète la valeur reçue, pas l'activité | Un sujet bouclé = un besoin satisfait. Le temps passé, lui, peut monter alors que la valeur baisse. |
| Indicateur avancé de la rétention | Le motif de départ est l'échec de clôture (E1). Cette métrique mesure la clôture directement. |
| Impossible à gonfler sans servir l'utilisateur | Envoyer plus de notifications ou ajouter du contenu ne l'augmente pas : seule la **conjonction** substance + clôture + fraîcheur compte. Le seul levier honnête est de rendre la compréhension moins coûteuse. |
| Actionnable par chaque équipe | Ingestion → plus de sujets pertinents entrent ; Résolution → moins d'effort par sujet ; Attention → plus de sujets atteignent la clôture ; Mémoire → moins de sujets doivent être re-parcourus. |
| Corrélée au revenu | La conversion se joue au moment où l'utilisateur constate qu'il **finit**. Hypothèse à valider en boucle 3. |

### Paliers (hypothèses à calibrer, non des faits)

| Palier | SBU/sem | Interprétation |
|---|---|---|
| Activation | ≥ 3 | L'utilisateur a compris la promesse. |
| Habitude | ≥ 8 | Le produit a remplacé un réflexe existant. |
| Référence | ≥ 15 | Il est devenu l'infrastructure informationnelle de la personne. |

### Garde-fous (à surveiller avec la même rigueur que la NSM)

| Garde-fou | Direction attendue | Rôle |
|---|---|---|
| **Temps médian par sujet bouclé** | ↓ | Empêche d'acheter la NSM avec du temps utilisateur. **Si la NSM monte et que ce garde-fou monte aussi, nous avons perdu.** |
| **Dette informationnelle** (âge médian de la file non lue) | ↓, plafonnée | Mesure directe du problème que nous prétendons résoudre. |
| **Indice de pluralité** (% de sujets bouclés exposés à ≥ 2 orientations éditoriales distinctes) | ↑ | Empêche de fabriquer de la clôture facile en servant une chambre d'écho. |
| **Taux de session close** (% de sessions terminées sur une file vide) | ↑ | Mesure la promesse « finie ». |
| **Retour à la source** (% de sujets bouclés avec ≥ 1 ouverture de l'article d'origine) | ↑ | Notre contribution à l'écosystème qui nous alimente. Une IA qui ne renvoie jamais à la source détruit ses propres fournisseurs. |
| **Rétention S4 · conversion payant** | ↑ | Validation économique. |

### Métriques explicitement refusées comme objectifs

**Temps passé · sessions par jour · DAU comme cible · profondeur de défilement · notifications envoyées · articles ouverts · nombre de flux ajoutés.**

Elles sont utiles en diagnostic, jamais en objectif. Toute proposition qui les améliore en dégradant la NSM ou ses garde-fous est refusée par construction. *Ce paragraphe est le paragraphe le plus important du document : c'est le seul qui coûte de l'argent.*

---

## 7. Piliers fonctionnels

*Note de l'Information Architect : six piliers. Chacun définit un domaine de capacités, ce qu'il emprunte à l'état de l'art, ce qu'il exclut, et son hypothèse de risque. Un pilier sans hors-périmètre n'est pas un pilier, c'est une ambition.*

### Pilier 1 — Ingestion souveraine

**Intention.** L'utilisateur déclare ce qui compte ; le système va le chercher partout, quel que soit le format ou l'absence de format.

**Capacités.** RSS/Atom · newsletters (adresse dédiée) · podcasts · vidéo et ses transcriptions · PDF, EPUB, documents longs · **surveillance de pages web sans flux** (le savoir-faire d'Inoreader, désormais indispensable puisque le web ouvert cesse d'exposer des flux) · import OPML et export permanent.

**Emprunté à.** Inoreader (largeur d'ingestion, surveillance de pages), Readwise Reader (documents et formats longs), Pocket Casts (abonnements audio).

**Hors périmètre.** Contournement de paywall ; scraping de plateformes fermées contre leurs conditions ; recommandation de sources que l'utilisateur n'a pas choisies (voir P3 pour la découverte, qui reste toujours explicite).

**Hypothèse de risque.** *La largeur d'ingestion est un fossé de dix ans, pas une fonctionnalité de trimestre.* À traiter comme un investissement d'infrastructure, avec une couverture minimale crédible dès le premier jour sinon P1 et P4 ne s'inscriront jamais.

---

### Pilier 2 — Résolution en événements

**Intention.** Faire passer l'unité de travail de l'article au sujet. Quarante reprises d'une dépêche deviennent **un** objet, avec sa chronologie et son état d'avancement.

**Capacités.** Regroupement multi-sources et multi-langues · détection de la reprise de dépêche et du contenu dérivé · chronologie d'un sujet dans la durée · état de suivi persistant (nouveau / en cours / bouclé / rouvert) · **réouverture automatique** quand un fait matériellement nouveau tombe sur un sujet déjà bouclé · synthèse **à durée choisie par l'utilisateur** (30 s / 3 min / intégral) avec attribution ligne à ligne.

**Emprunté à.** Particle (synthèse multi-angles, modulation du registre) — mais appliqué au corpus **possédé** de l'utilisateur, ce que Particle ne peut structurellement pas faire.

**Hors périmètre.** Décider de ce qui est vrai. Classer les sources par qualité selon notre propre jugement. Produire du texte non rattaché à une source identifiable. Écarter définitivement un contenu sans que l'utilisateur puisse voir ce qui a été écarté et pourquoi.

**Hypothèse de risque.** *Un mauvais regroupement est plus grave qu'une absence de regroupement.* Fusionner deux événements distincts détruit la confiance instantanément et irrémédiablement. Doctrine : en cas de doute, **ne pas fusionner**. Cible de précision à définir en boucle 2, mais la précision prime le rappel — sans discussion.

---

### Pilier 3 — Panorama et transparence

**Intention.** Rendre visible la structure de la couverture. Pas *quoi penser* — **qui parle, qui se tait, et à qui il appartient**.

**Capacités.** Répartition des orientations éditoriales sur un événement · propriété capitalistique et financement des sources · historique de factualité · **détection d'angle mort appliquée aux sources de l'utilisateur** (« ce sujet est absent de 80 % de vos abonnements ») · suggestion de source complémentaire, toujours explicite et refusable · tableau de bord personnel d'exposition.

**Emprunté à.** Ground News (référence du domaine). **Notre différence :** Ground News décrit un corpus qu'il a choisi ; nous décrivons **le corpus que l'utilisateur a choisi**. Le miroir devient personnel, donc actionnable — et le décalage entre les deux, c'est exactement le job F3.

**Hors périmètre.** Notation de crédibilité maison. Étiquetage politique propriétaire non sourcé (nous nous appuyons sur des référentiels d'évaluation externes, cités et contestables). Modification silencieuse de l'exposition d'un utilisateur « pour son bien ».

**Hypothèse de risque.** *Ce pilier peut être perçu comme militant.* La méthodologie doit être publique, les référentiels cités, et le pilier doit fonctionner de façon identique quelles que soient les opinions de l'utilisateur. Persona de test : Amira (P5). Si elle le juge orienté, il est raté.

---

### Pilier 4 — Budget d'attention

**Intention.** Traiter l'attention comme une ressource finie et déclarée. C'est le pilier qui distingue ce produit de tous les autres.

**Capacités.** Déclaration d'un budget (« 10 minutes ce matin ») et adaptation de la restitution à ce budget · **file finie et bouclable** · dette informationnelle visible et adressable · **pardon de l'absence** : après une interruption, le système propose une reprise condensée au lieu d'un arriéré brut · règles et automatisation du tri **sans coût de configuration** (le système propose la règle à partir du comportement observé, l'utilisateur valide) · alertes rares, motivées, et dont le silence est fiable.

**Emprunté à.** Pocket Casts (*Up Next* — la file finie, la reprise, la clôture) et Inoreader (moteur de règles), mais avec l'inversion décisive : **le système propose la règle, l'utilisateur ne la programme pas**.

**Hors périmètre.** Séries à entretenir, badges de non-lus, compteurs de culpabilité, gamification de l'assiduité. Notifications d'engagement. Tout mécanisme dont l'effet est de faire revenir l'utilisateur sans qu'il en tire un bénéfice.

**Hypothèse de risque.** *Le « pardon de l'absence » est peut-être la fonctionnalité la plus différenciante du produit — et elle est invisible en démonstration.* Elle ne se manifeste qu'au retour d'une absence, c'est-à-dire au moment exact où les concurrents perdent leurs utilisateurs. Elle ne se vendra pas en capture d'écran ; elle se vendra en rétention à la semaine 4.

---

### Pilier 5 — Continuité multimodale

**Intention.** Un sujet, trois modalités, un seul état. Ce qui est lu à moitié se termine à l'oreille, et réciproquement.

**Capacités.** Lecture, écoute et visionnage du **même objet** · position unique partagée entre modalités et appareils · synthèse vocale de qualité pour ce qui n'existe qu'en texte · extraction du passage pertinent d'un long contenu audio ou vidéo · file d'attente unifiée toutes modalités · hors-ligne complet · vitesse, saut de silence, chapitrage.

**Emprunté à.** Pocket Casts (tout l'artisanat de la consommation différée, généralisé au-delà du podcast) et Particle (extraction de moments de podcast).

**Hors périmètre.** Production de contenu original. Clonage de voix de journalistes ou de présentateurs. Traduction audio automatique en v1 (excellent sujet, mauvais moment).

**Hypothèse de risque.** *La qualité vocale est un seuil, pas un curseur.* Une synthèse vocale médiocre ne dégrade pas l'expérience : elle annule le pilier. Aucun compromis possible sur ce point ; c'est un critère de sélection de fournisseur, pas une optimisation ultérieure.

---

### Pilier 6 — Mémoire et restitution

**Intention.** La consommation produit du capital. Ce qui a été compris reste mobilisable.

**Capacités.** Annotations et notes sur toutes les modalités, y compris audio · recherche unifiée sur tout ce qui a été consommé · **rappel contextuel** (« vous avez suivi ce sujet en mars ; voici ce que vous en aviez retenu ») · remontée différée d'annotations · export de premier rang (Obsidian, Notion, Markdown, API) · citation traçable jusqu'à la source exacte, horodatée.

**Emprunté à.** Readwise Reader (référence incontestée), connecté pour la première fois à un flux d'actualité vivant — ce que Readwise ne fait pas et que personne ne fait.

**Hors périmètre.** Devenir un outil de prise de notes généraliste. Concurrencer Obsidian ou Notion : nous **alimentons** ces outils, nous ne les remplaçons pas. Verrouiller les données par un export dégradé.

**Hypothèse de risque.** *Ce pilier est un accélérateur de rétention, pas un moteur d'acquisition.* Personne ne s'abonne pour la mémoire ; beaucoup restent grâce à elle. À financer sur le budget de rétention, à ne jamais mettre en avant dans la promesse d'entrée — sous peine de ressembler à un outil de PKM et de perdre P2.

---

### Vue d'ensemble

| Pilier | Job principal servi | Persona porteur | Nature |
|---|---|---|---|
| 1 · Ingestion souveraine | F1, F7 | P1, P4 | Fossé défensif |
| 2 · Résolution en événements | F2 | Tous | **Différenciateur de rupture** |
| 3 · Panorama et transparence | F3, S2 | P2, P3, P5 | Différenciateur de confiance |
| 4 · Budget d'attention | F6, E1, E2, E3 | P2 | **Cœur de la mission** |
| 5 · Continuité multimodale | F4 | P2, P5 | Levier d'usage |
| 6 · Mémoire et restitution | F5, S2 | P3, P4 | Verrou de rétention |

**Ordre de dépendance.** 1 conditionne 2 ; 2 conditionne 3 et 4 ; 5 et 6 amplifient sans conditionner. **Un produit qui livrerait 1 sans 2 serait un Inoreader de plus.**

---

## 8. Principes produit

*Chaque principe est un arbitrage, pas un vœu. Un principe qui ne coûte rien n'est pas un principe.*

### 1. L'événement avant l'article
**Nous choisissons** la compréhension d'un sujet **plutôt que** l'exhaustivité de la couverture.
*Conséquence :* jamais de vue par défaut « tous les articles, par ordre chronologique ».
*Ce que ça coûte :* nous décevrons les utilisateurs qui veulent voir passer chaque item. Ils resteront chez Inoreader, et c'est le bon résultat.

### 2. « Fini » est une fonctionnalité
**Nous choisissons** une file qui se vide **plutôt qu'**un flux qui coule.
*Conséquence :* toute session doit pouvoir se terminer ; le produit doit savoir dire « c'est tout ».
*Ce que ça coûte :* nos chiffres d'engagement paraîtront médiocres à côté de ceux du secteur. Il faudra le tenir devant un investisseur.

### 3. L'utilisateur possède ses sources
**Nous choisissons** le contrôle explicite **plutôt que** la commodité algorithmique.
*Conséquence :* import et export libres, permanents, sans dégradation. Aucune source injectée sans accord.
*Ce que ça coûte :* un onboarding plus exigeant, et un verrou de rétention plus faible. Assumé : nous préférons qu'on reste par choix.

### 4. Montrer la structure, jamais trancher le vrai
**Nous choisissons** de cartographier le désaccord **plutôt que** de le résoudre.
*Conséquence :* aucune note de crédibilité maison, aucun verdict. Méthodologie publique et contestable.
*Ce que ça coûte :* les utilisateurs qui veulent qu'on leur dise qui a raison seront frustrés. C'est le prix de la neutralité, et c'est le seul moyen de survivre à un cycle électoral.

### 5. L'IA résume, elle ne remplace pas la source
**Nous choisissons** l'attribution ligne à ligne **plutôt que** la fluidité du texte généré.
*Conséquence :* toute affirmation synthétisée pointe vers son origine. Aucun contenu orphelin. Le retour à la source est mesuré et optimisé.
*Ce que ça coûte :* des synthèses moins élégantes, et un coût d'ingénierie supérieur. Non négociable : c'est la condition de S2, de la survie juridique et de la santé de l'écosystème qui nous alimente.

### 6. Le temps de l'utilisateur est un coût, pas une recette
**Nous choisissons** l'abonnement **plutôt que** la publicité — et nous nous interdisons de mesurer le succès en temps passé.
*Conséquence :* aucune publicité, jamais. Le temps médian par sujet bouclé est un garde-fou permanent.
*Ce que ça coûte :* aucun palier gratuit financé par la publicité, donc une acquisition plus lente et plus chère.

### 7. Une même chose, trois modalités, un seul état
**Nous choisissons** la continuité **plutôt que** l'optimisation par canal.
*Conséquence :* aucune fonctionnalité ne peut exister dans une seule modalité si l'autre est plausible.
*Ce que ça coûte :* chaque fonctionnalité coûte plus cher à concevoir et à livrer.

### 8. Ce qui est consommé doit rester retrouvable
**Nous choisissons** la mémoire durable **plutôt que** la fraîcheur exclusive.
*Conséquence :* rien de consommé n'est jeté ; tout est cherchable et exportable.
*Ce que ça coûte :* stockage, complexité de recherche, obligations de conformité.

### 9. Le défaut doit être calme
**Nous choisissons** le silence fiable **plutôt que** la réactivité.
*Conséquence :* notifications sur activation explicite uniquement, motivées, rares. Aucun badge de non-lus par défaut.
*Ce que ça coûte :* moins de réengagement. Compensé par la confiance : un système qui ne crie jamais pour rien est cru quand il parle.

### 10. Les sources doivent y gagner
**Nous choisissons** un écosystème viable **plutôt que** l'extraction maximale.
*Conséquence :* le retour à la source est une métrique suivie ; nous respectons les paywalls et les préférences des éditeurs ; nous n'écrasons pas l'identité des sources dans nos synthèses.
*Ce que ça coûte :* une expérience parfois moins fluide qu'un produit qui se sert sans rendre. Un agrégateur qui assèche ses sources se supprime lui-même avec un décalage de trois ans.

### Test de cohérence

Une décision produit est recevable si elle passe ces trois questions :
1. **Réduit-elle le temps nécessaire pour boucler un sujet ?** (mission)
2. **L'anti-persona A en serait-il plus heureux ?** Si oui → refus. (positionnement)
3. **Peut-on l'expliquer sans mentir sur ce que nous mesurons ?** (principe 6)

---

## Ce que cette boucle ne tranche pas

Honnêteté sur les angles morts de ce document — ce sont les entrées de la boucle 2, par ordre d'urgence :

1. **Économie unitaire de la résolution en événements.** Le coût d'inférence par événement, et non par utilisateur, décide du positionnement tarifaire (§5.4) — et donc de la capacité à tenir la mission sur P2. **C'est le préalable à tout le reste.**
2. **Faisabilité du regroupement multilingue et longue traîne.** Le pilier 2 est le pari central ; sa précision réelle sur des sources de niche est non démontrée.
3. **Séquencement de mise sur le marché.** Six piliers, ce n'est pas une v1. Quel sous-ensemble minimal démontre la thèse et à quel persona s'adresse-t-il en premier ? *Intuition du PM à challenger : piliers 1 + 2 + 4 sur le persona P1, parce qu'il paie, qu'il tolère la friction initiale et qu'il détecte immédiatement un mauvais regroupement.*
4. **Droit et relations éditeurs.** Un produit qui résume des contenus sous droits sur des marchés européens a besoin d'une doctrine avant d'avoir des utilisateurs.
5. **Validation des paliers de la North Star.** Les seuils du §6 sont des hypothèses assumées. Ils ne deviendront des objectifs qu'après mesure.

---

## Sources et niveau de confiance

Données concurrentielles relevées en **août 2026**. Les prix et les fonctionnalités de cette catégorie évoluent vite : à revalider à chaque boucle.

| Sujet | Confiance | Source |
|---|---|---|
| Évitement de l'information (42 % ; 50 % R-U ; 45 % É-U ; 29 % en 2017) | Moyenne — chiffres relevés via synthèses de presse, **à recouper sur le rapport primaire** (accès direct bloqué depuis cet environnement) | [Reuters Institute — Digital News Report 2026](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary) · [Press Gazette](https://pressgazette.co.uk/publishers/digital-journalism/news-publishing-trends-for-2026/) · [EFJ](https://europeanjournalists.org/blog/2026/06/26/2025-digital-news-report-navigating-journalism-amid-a-continued-crisis-of-trust/) |
| Inoreader — tarifs et fonctionnalités | Élevée | [Inoreader — Tarifs](https://www.inoreader.com/pricing) · [Readless](https://www.readless.app/blog/inoreader-pricing-2026) |
| Particle — fonctionnalités et tarifs | Élevée | [Comparateur-IA](https://comparateur-ia.com/en/ai-tools/particle-news) · [HyperAI — clips de podcast](https://hyper.ai/en/stories/32b05bcf13cf498681c503380fca9038) |
| Ground News — Blindspot, paliers, tarifs | Élevée | [Ground News — Blindspot](https://ground.news/blindspot) · [Ground News — Abonnements](https://ground.news/subscribe) · [StationX](https://www.stationx.net/ground-news-review/) |
| Readwise Reader — tarifs et fonctionnalités | Élevée | [Readless](https://www.readless.app/blog/readwise-reader-pricing-2026) · [Nutshell](https://www.nutshellnewsletter.com/blog/best-rss-feed-readers-2026) |
| Pocket Casts — fonctionnalités, file, tarifs | Élevée | [Pocket Casts](https://pocketcasts.com/podcast-player) · [Engadget](https://www.engadget.com/entertainment/streaming/pocket-casts-makes-its-web-player-and-desktop-apps-usable-without-a-subscription-193035046.html) |
