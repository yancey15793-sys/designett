/**
 * North Star Metric — « Sujets Bouclés par Utilisateur Actif et par Semaine ».
 *
 * Le point le plus facile à rater de tout le produit tient en une phrase :
 * `bouclé` (un statut, visible par l'utilisateur) et `compté dans la NSM`
 * (une mesure, jamais montrée) sont DEUX choses différentes.
 *
 * Un sujet bouclé au-delà de la fenêtre de fraîcheur reste bouclé. Il n'est
 * simplement pas compté. Confondre les deux reviendrait à reprocher une
 * lenteur à l'utilisateur — ce qu'interdit le job émotionnel E1 de la
 * boucle 1 (« clôture, pas culpabilité »).
 *
 * Les deux fonctions portent donc des noms qu'on ne peut pas intervertir par
 * distraction, et `compteDansNsm` n'est appelée nulle part dans l'interface.
 */

import type { Modalite, Progression, SujetSuivi } from './types';

/** Boucle 1 §6. Hypothèses assumées, à calibrer — jamais mesurées à ce jour. */
export const SEUILS_SUBSTANCE = {
  texte: { tauxMin: 0.7, secondesMin: 90 },
  audio: { tauxMin: 0.6, secondesMin: 180 },
} as const;

export const FENETRE_FRAICHEUR_JOURS = 7;

const MS_PAR_JOUR = 86_400_000;

function estAudio(m: Modalite): boolean {
  return m === 'audio_natif' || m === 'audio_synthese';
}

/**
 * Condition 1 — substance.
 * Satisfaite dès qu'UNE unité consommée dépasse son seuil : on ne demande
 * pas de tout lire, on demande d'avoir vraiment lu quelque chose.
 */
export function substanceAtteinte(
  progressions: readonly Progression[],
): boolean {
  return progressions.some((p) => {
    const seuils = estAudio(p.modaliteDerniere)
      ? SEUILS_SUBSTANCE.audio
      : SEUILS_SUBSTANCE.texte;
    return (
      p.tauxCompletion >= seuils.tauxMin ||
      p.secondesActives >= seuils.secondesMin
    );
  });
}

/** Condition 2 — clôture. Statut visible par l'utilisateur. */
export function estBoucle(sujet: SujetSuivi): boolean {
  return sujet.statut === 'boucle' && sujet.boucleLe !== null;
}

/** Condition 3 — fraîcheur. Filtre de MESURE, jamais affiché. */
export function delaiDeClotureJours(sujet: SujetSuivi): number | null {
  if (!sujet.boucleLe) return null;
  const entre = Date.parse(sujet.entreLe);
  const boucle = Date.parse(sujet.boucleLe);
  if (Number.isNaN(entre) || Number.isNaN(boucle)) return null;
  return (boucle - entre) / MS_PAR_JOUR;
}

/**
 * Les trois conditions réunies.
 *
 * NE JAMAIS appeler depuis un composant : cette fonction produit un jugement
 * sur la performance de l'utilisateur, et ce jugement ne lui appartient pas.
 * Elle n'est légitime que dans la couche analytique.
 */
export function compteDansNsm(
  sujet: SujetSuivi,
  progressions: readonly Progression[],
): boolean {
  if (!estBoucle(sujet)) return false;
  if (!substanceAtteinte(progressions)) return false;
  const delai = delaiDeClotureJours(sujet);
  return delai !== null && delai <= FENETRE_FRAICHEUR_JOURS;
}

/**
 * Garde-fou principal : le temps médian par sujet bouclé doit BAISSER.
 * Si la NSM monte et que cette valeur monte aussi, la thèse est perdue.
 */
export function tempsMedianParSujetBoucleS(
  sujets: readonly SujetSuivi[],
): number | null {
  const durees = sujets
    .filter(estBoucle)
    .map((s) => s.tempsConsommeS)
    .sort((a, b) => a - b);
  if (durees.length === 0) return null;
  const milieu = Math.floor(durees.length / 2);
  return durees.length % 2 === 0
    ? (durees[milieu - 1]! + durees[milieu]!) / 2
    : durees[milieu]!;
}

/** Dette informationnelle : âge médian, en jours, de la file non traitée. */
export function detteInformationnelleJours(
  sujets: readonly SujetSuivi[],
  maintenant: Date = new Date(),
): number | null {
  const ages = sujets
    .filter((s) => s.statut === 'nouveau' || s.statut === 'en_cours')
    .map((s) => (maintenant.getTime() - Date.parse(s.entreLe)) / MS_PAR_JOUR)
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  if (ages.length === 0) return null;
  const milieu = Math.floor(ages.length / 2);
  return ages.length % 2 === 0
    ? (ages[milieu - 1]! + ages[milieu]!) / 2
    : ages[milieu]!;
}
