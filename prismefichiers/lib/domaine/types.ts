/**
 * Types du domaine — traduction directe du modèle de la boucle 2.
 *
 * Cette couche ne connaît ni React, ni Next, ni Supabase. C'est la
 * contrainte qui rend le reste testable et remplaçable.
 */

// ─── Corpus mutualisé (décision A1) ──────────────────────────────────────

export type NatureSource =
  | 'rss'
  | 'infolettre'
  | 'podcast'
  | 'video'
  | 'surveillance'
  | 'depot';

export type SanteSource = 'saine' | 'degradee' | 'rompue';

export type Modalite =
  | 'texte'
  | 'audio_natif'
  | 'audio_synthese'
  | 'video'
  | 'transcription';

export type Vivacite = 'chaud' | 'actif' | 'stabilise' | 'clos';

export type RoleRattachement =
  | 'primaire'
  | 'reprise'
  | 'analyse'
  | 'reaction'
  | 'correction';

/** A4 — le doute est porté par le lien, jamais masqué. */
export type StatutRattachement = 'confirme' | 'candidat' | 'rejete';

export type DureeCible = '30s' | '3min' | 'integral';

export type RegistreSynthese = 'neutre' | 'contradictoire' | 'vulgarise';

export interface Editeur {
  readonly id: string;
  readonly nom: string;
  readonly pays: string | null;
  readonly proprietaire: string | null;
  readonly financement: string | null;
}

export interface Source {
  readonly id: string;
  readonly editeurId: string;
  readonly nature: NatureSource;
  readonly uri: string;
  readonly sante: SanteSource;
  /** Mesure l'amortissement du coût mutualisé — voir §4.1 de la boucle 2. */
  readonly abonnesActifs: number;
}

export interface Item {
  readonly id: string;
  readonly sourceId: string;
  readonly editeurId: string;
  readonly uriCanonique: string;
  readonly titre: string;
  readonly publieLe: string;
  readonly langue: string;
  readonly dureeEstimeeS: number;
}

/**
 * A6 — position neutre, indépendante de la modalité.
 * Jamais un offset de texte, jamais un timecode : les deux s'en déduisent
 * par la table d'alignement.
 */
export interface AncrageCanonique {
  readonly bloc: number;
  readonly decalage: number;
}

export interface Evenement {
  readonly id: string;
  readonly titreCanonique: string;
  readonly apparuLe: string;
  readonly dernierFaitLe: string;
  readonly vivacite: Vivacite;
}

export interface Rattachement {
  readonly id: string;
  readonly evenementId: string;
  readonly itemId: string;
  readonly role: RoleRattachement;
  readonly confiance: number;
  readonly statut: StatutRattachement;
}

export interface Citation {
  readonly id: string;
  readonly assertionId: string;
  readonly itemId: string;
  readonly ancrage: AncrageCanonique;
}

export interface Assertion {
  readonly id: string;
  readonly rang: number;
  readonly enonce: string;
  /** R8 — au moins une, toujours. Le type l'exige, le schéma l'impose. */
  readonly citations: readonly Citation[];
}

export interface Synthese {
  readonly id: string;
  readonly evenementId: string;
  readonly dureeCible: DureeCible;
  readonly registre: RegistreSynthese;
  readonly langue: string;
  readonly assertions: readonly Assertion[];
}

export interface Jalon {
  readonly id: string;
  readonly evenementId: string;
  readonly survenuLe: string;
  readonly libelle: string;
  readonly declencheReouverture: boolean;
}

/** Orientation éditoriale — ordinale, de −3 (pôle froid) à +3 (pôle chaud). */
export type CranOrientation = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface Couverture {
  readonly evenementId: string;
  readonly nbEditeurs: number;
  /** Nombre d'éditeurs par cran d'orientation. */
  readonly repartitionOrientations: Readonly<Record<CranOrientation, number>>;
  readonly editeursIds: readonly string[];
}

// ─── Couche personnelle (décision A1) ────────────────────────────────────

export type StatutSujet =
  | 'nouveau'
  | 'en_cours'
  | 'boucle'
  | 'rouvert'
  | 'ecarte';

export type OrigineSujet = 'abonnement' | 'regle' | 'recherche' | 'rappel';

export interface SujetSuivi {
  readonly id: string;
  readonly utilisateurId: string;
  readonly evenementId: string;
  readonly statut: StatutSujet;
  readonly entreLe: string;
  readonly boucleLe: string | null;
  readonly substanceAtteinte: boolean;
  readonly tempsConsommeS: number;
  readonly origine: OrigineSujet;
  /** Échéance d'un report. Il n'existe pas de report sans date (boucle 4 §8). */
  readonly reporteAu: string | null;
  readonly nbReports: number;
}

export interface Progression {
  readonly id: string;
  readonly sujetSuiviId: string;
  readonly itemId: string;
  readonly ancrageCanonique: AncrageCanonique;
  readonly tauxCompletion: number;
  readonly secondesActives: number;
  readonly modaliteDerniere: Modalite;
  readonly majLe: string;
}

export type IssueSession =
  | 'file_vide'
  | 'budget_epuise'
  | 'abandon'
  | 'interrompue';

export interface Session {
  readonly id: string;
  readonly utilisateurId: string;
  readonly budgetDeclareS: number;
  readonly tempsReelS: number;
  readonly issue: IssueSession | null;
  readonly repriseApresAbsence: boolean;
  readonly ouverteLe: string;
}

export interface Abonnement {
  readonly id: string;
  readonly utilisateurId: string;
  readonly sourceId: string;
  readonly editeurId: string;
  readonly priorite: number;
  readonly silencieux: boolean;
}

export interface Annotation {
  readonly id: string;
  readonly utilisateurId: string;
  readonly itemId: string;
  readonly ancrageCanonique: AncrageCanonique;
  readonly modaliteCapture: Modalite;
  readonly extrait: string;
  readonly note: string | null;
  readonly creeLe: string;
}
