/**
 * Ordonnancement de la file — la question ouverte depuis la boucle 2.
 *
 * Elle est tranchée ici de la seule manière honnête : par une INTERFACE qui
 * impose le contrat, plus une stratégie v0 explicite et remplaçable.
 *
 * Le contrat (boucle 4 §0.3) :
 *   O1  entrées : sujets éligibles, coût estimé, budget, dette, priorité
 *   O2  sortie  : séquence FINIE, somme des coûts ≤ budget, bornée à la
 *                 construction et non tronquée à l'affichage
 *   O3  déterminisme : même état ⇒ même ordre
 *   O4  explicabilité : chaque entrée répond à « pourquoi celui-là maintenant ? »
 *   O5  le rang ne dépend jamais de la popularité ni du temps passé dans l'app
 *
 * O4 n'est pas une convention d'équipe : `pourquoi` est un champ OBLIGATOIRE
 * du type de retour. Un ordonnanceur incapable de se justifier ne compile pas.
 */

import type { SujetSuivi } from './types';

// ─── Contrat ─────────────────────────────────────────────────────────────

export type FacteurOrdonnancement =
  | 'report_echu'
  | 'reouverture'
  | 'dette'
  | 'fait_recent'
  | 'priorite_source';

export interface Justification {
  /** Le facteur dominant, celui qui a réellement fait le rang. */
  readonly facteur: FacteurOrdonnancement;
  /** Phrase affichable telle quelle. O4 s'arrête ici, pas à un score brut. */
  readonly phrase: string;
}

export interface SujetEligible {
  readonly sujet: SujetSuivi;
  readonly coutEstimeS: number;
  readonly dernierFaitLe: string;
  readonly reouvertParJalon: boolean;
  /** Priorité maximale parmi les abonnements couvrant ce sujet (0–3). */
  readonly prioriteSource: number;
}

export interface EntreeFile {
  readonly sujetId: string;
  readonly rang: number;
  readonly coutEstimeS: number;
  readonly pourquoi: Justification;
}

export interface FileOrdonnee {
  readonly entrees: readonly EntreeFile[];
  readonly coutTotalS: number;
  readonly budgetS: number;
  /** Non retenus faute de place. Jamais présentés comme un retard. */
  readonly nonRetenus: readonly string[];
}

export interface ContexteOrdonnancement {
  readonly budgetS: number;
  readonly maintenant: Date;
}

export interface Ordonnanceur {
  readonly nom: string;
  ordonner(
    eligibles: readonly SujetEligible[],
    contexte: ContexteOrdonnancement,
  ): FileOrdonnee;
}

// ─── Stratégie v0 ────────────────────────────────────────────────────────

const MS_PAR_JOUR = 86_400_000;

/**
 * Poids v0. Volontairement peu nombreux et lisibles : un ordonnanceur qu'on
 * ne sait pas expliquer à un utilisateur est disqualifié, quelle que soit sa
 * performance. Ces valeurs sont des hypothèses à calibrer, pas des faits.
 */
export const POIDS_V0 = {
  reportEchu: 100,
  reouverture: 60,
  dette: 8, // par jour d'attente, plafonné
  detteMax: 40,
  faitRecent: 20, // décroît sur 48 h
  prioriteSource: 10, // par cran
} as const;

interface Score {
  readonly total: number;
  readonly justification: Justification;
}

function scorer(e: SujetEligible, maintenant: Date): Score {
  const parts: Array<{ facteur: FacteurOrdonnancement; valeur: number }> = [];

  // Un report échu est une promesse faite à l'utilisateur : elle passe devant.
  if (e.sujet.reporteAu && Date.parse(e.sujet.reporteAu) <= maintenant.getTime()) {
    parts.push({ facteur: 'report_echu', valeur: POIDS_V0.reportEchu });
  }

  // Une réouverture signifie que le monde a changé, pas que nous voulons une visite.
  if (e.reouvertParJalon || e.sujet.statut === 'rouvert') {
    parts.push({ facteur: 'reouverture', valeur: POIDS_V0.reouverture });
  }

  // La dette évite la famine : ce qui attend depuis longtemps remonte.
  const ageJours = Math.max(
    0,
    (maintenant.getTime() - Date.parse(e.sujet.entreLe)) / MS_PAR_JOUR,
  );
  if (ageJours > 0) {
    parts.push({
      facteur: 'dette',
      valeur: Math.min(ageJours * POIDS_V0.dette, POIDS_V0.detteMax),
    });
  }

  // Fraîcheur du dernier fait, décroissante sur 48 h.
  const heures = Math.max(
    0,
    (maintenant.getTime() - Date.parse(e.dernierFaitLe)) / 3_600_000,
  );
  if (Number.isFinite(heures)) {
    const frais = Math.max(0, 1 - heures / 48);
    if (frais > 0) {
      parts.push({ facteur: 'fait_recent', valeur: frais * POIDS_V0.faitRecent });
    }
  }

  if (e.prioriteSource > 0) {
    parts.push({
      facteur: 'priorite_source',
      valeur: e.prioriteSource * POIDS_V0.prioriteSource,
    });
  }

  const total = parts.reduce((s, p) => s + p.valeur, 0);
  const dominant = parts.reduce(
    (max, p) => (p.valeur > max.valeur ? p : max),
    parts[0] ?? { facteur: 'dette' as const, valeur: 0 },
  );

  return { total, justification: expliquer(dominant.facteur, e, ageJours) };
}

function expliquer(
  facteur: FacteurOrdonnancement,
  e: SujetEligible,
  ageJours: number,
): Justification {
  switch (facteur) {
    case 'report_echu':
      return { facteur, phrase: 'Vous aviez demandé à le revoir aujourd’hui.' };
    case 'reouverture':
      return { facteur, phrase: 'Un fait nouveau est tombé sur un sujet que vous aviez bouclé.' };
    case 'dette':
      return {
        facteur,
        phrase: `En attente depuis ${Math.round(ageJours)} jour${ageJours >= 2 ? 's' : ''}.`,
      };
    case 'fait_recent':
      return { facteur, phrase: 'Le sujet bouge en ce moment.' };
    case 'priorite_source':
      return { facteur, phrase: 'Vient d’une source que vous avez placée en priorité.' };
  }
}

/**
 * Remplissage glouton sous budget.
 *
 * On ne s'arrête PAS au premier sujet trop gros : on continue à descendre le
 * classement pour combler la place restante. Un budget de 10 min qui laisse
 * 3 min vides parce que le 4ᵉ sujet en coûtait 5 est un mauvais résultat.
 *
 * Départage déterministe par identifiant (O3) : rouvrir une session sans
 * nouvelle ingestion redonne exactement le même ordre.
 */
export class OrdonnanceurV0 implements Ordonnanceur {
  readonly nom = 'v0-explicable';

  ordonner(
    eligibles: readonly SujetEligible[],
    contexte: ContexteOrdonnancement,
  ): FileOrdonnee {
    const classes = eligibles
      .map((e) => ({ e, s: scorer(e, contexte.maintenant) }))
      .sort((a, b) =>
        b.s.total !== a.s.total
          ? b.s.total - a.s.total
          : a.e.sujet.id.localeCompare(b.e.sujet.id),
      );

    const entrees: EntreeFile[] = [];
    const nonRetenus: string[] = [];
    let cumul = 0;

    for (const { e, s } of classes) {
      if (cumul + e.coutEstimeS <= contexte.budgetS) {
        entrees.push({
          sujetId: e.sujet.id,
          rang: entrees.length + 1,
          coutEstimeS: e.coutEstimeS,
          pourquoi: s.justification,
        });
        cumul += e.coutEstimeS;
      } else {
        nonRetenus.push(e.sujet.id);
      }
    }

    return {
      entrees,
      coutTotalS: cumul,
      budgetS: contexte.budgetS,
      nonRetenus,
    };
  }
}

export const ordonnanceurParDefaut: Ordonnanceur = new OrdonnanceurV0();
