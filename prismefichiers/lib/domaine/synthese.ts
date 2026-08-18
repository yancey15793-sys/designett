/**
 * Servabilité d'une synthèse — application de R8.
 *
 * « Aucune assertion sans citation » n'est pas une consigne de rédaction :
 * c'est une contrainte de schéma (voir supabase/migrations/0003) doublée
 * d'une garde applicative. Une synthèse dont une assertion a perdu sa
 * dernière citation n'est PAS servie dans une version dégradée : elle n'est
 * pas servie du tout, et l'interface bascule sur la liste des items en
 * disant pourquoi.
 *
 * Servir un texte partiellement sourcé pour éviter un écran vide, c'est
 * renoncer au principe 5 en silence.
 */

import type { Synthese } from './types';

export type EtatSynthese =
  | { readonly servable: true; readonly synthese: Synthese }
  | { readonly servable: false; readonly raison: RaisonNonServable };

export type RaisonNonServable =
  | 'assertion_sans_citation'
  | 'synthese_vide'
  | 'citation_irresolvable';

export const MESSAGES_NON_SERVABLE: Record<RaisonNonServable, string> = {
  assertion_sans_citation:
    'Synthèse indisponible — une source citée a été retirée.',
  synthese_vide: 'Synthèse indisponible — aucune assertion produite.',
  citation_irresolvable:
    'Synthèse indisponible — une citation ne peut plus être résolue.',
};

export function evaluerSynthese(
  synthese: Synthese,
  itemsDisponibles: ReadonlySet<string>,
): EtatSynthese {
  if (synthese.assertions.length === 0) {
    return { servable: false, raison: 'synthese_vide' };
  }
  for (const assertion of synthese.assertions) {
    if (assertion.citations.length === 0) {
      return { servable: false, raison: 'assertion_sans_citation' };
    }
    const resolvable = assertion.citations.some((c) =>
      itemsDisponibles.has(c.itemId),
    );
    if (!resolvable) {
      return { servable: false, raison: 'citation_irresolvable' };
    }
  }
  return { servable: true, synthese };
}

/**
 * A4 — un rattachement sous le seuil n'est jamais présenté comme fusionné.
 * Le seuil reste à calibrer sur corpus annoté (question ouverte n°1 de la
 * boucle 2) ; la doctrine, elle, est fixée : en cas de doute, ne pas fusionner.
 */
export const SEUIL_CONFIANCE_RATTACHEMENT = 0.82;

export function estFusionne(confiance: number, statut: string): boolean {
  return statut === 'confirme' && confiance >= SEUIL_CONFIANCE_RATTACHEMENT;
}
