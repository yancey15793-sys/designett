/**
 * Panorama — angle mort personnel et pluralité.
 *
 * L'angle mort est le différenciateur défendable du produit : Ground News
 * décrit un corpus qu'il a choisi ; nous décrivons celui que l'utilisateur a
 * choisi. Le calcul est donc TOUJOURS relatif aux abonnements — jamais à un
 * corpus maison.
 */

import type { Couverture, CranOrientation } from './types';

export const CRANS_ORIENTATION: readonly CranOrientation[] = [
  -3, -2, -1, 0, 1, 2, 3,
];

/**
 * Part de la couverture invisible depuis les sources de l'utilisateur.
 * 0 = tout est couvert par ses éditeurs · 1 = il ne verrait rien.
 */
export function angleMortPersonnel(
  couverture: Couverture,
  editeursAbonnesIds: readonly string[],
): number {
  if (couverture.nbEditeurs === 0) return 0;
  const abonnes = new Set(editeursAbonnesIds);
  const vus = couverture.editeursIds.filter((id) => abonnes.has(id)).length;
  return 1 - vus / couverture.nbEditeurs;
}

/**
 * Garde-fou « indice de pluralité » : au moins deux orientations distinctes
 * dans ce qui a été réellement consommé. Empêche de fabriquer de la clôture
 * facile en servant une chambre d'écho.
 */
export function pluraliteAtteinte(
  cransConsommes: readonly CranOrientation[],
): boolean {
  return new Set(cransConsommes).size >= 2;
}

export interface SegmentPanorama {
  readonly cran: CranOrientation;
  readonly part: number;
  /** Boucle 3 §1.5 : étiquetage direct obligatoire au-delà de 8 %. */
  readonly etiqueteDirectement: boolean;
}

export const SEUIL_ETIQUETAGE_DIRECT = 0.08;

export function segmentsPanorama(couverture: Couverture): SegmentPanorama[] {
  const total = CRANS_ORIENTATION.reduce<number>(
    (s, c) => s + (couverture.repartitionOrientations[c] ?? 0),
    0,
  );
  if (total === 0) return [];
  return CRANS_ORIENTATION.map((cran) => {
    const part = (couverture.repartitionOrientations[cran] ?? 0) / total;
    return {
      cran,
      part,
      etiqueteDirectement: part >= SEUIL_ETIQUETAGE_DIRECT,
    };
  }).filter((s) => s.part > 0);
}

/**
 * Plafond de séries de la palette catégorielle (propriété, financement).
 * Au-delà de 3, les paires ne tiennent plus le plancher toutes-paires : ce
 * n'est pas un choix esthétique, c'est la capacité mesurée du canal couleur.
 */
export const PLAFOND_SERIES_CATEGORIELLES = 3;

export function replierEnAutres<T extends { readonly valeur: number }>(
  series: readonly T[],
): { retenues: T[]; autres: number } {
  const tri = [...series].sort((a, b) => b.valeur - a.valeur);
  const retenues = tri.slice(0, PLAFOND_SERIES_CATEGORIELLES - 1);
  const reste = tri.slice(PLAFOND_SERIES_CATEGORIELLES - 1);
  return {
    retenues,
    autres: reste.reduce((s, x) => s + x.valeur, 0),
  };
}
