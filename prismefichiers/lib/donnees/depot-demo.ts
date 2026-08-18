import 'server-only';

import type { Depot, SujetAffichable } from './depot';
import type { SujetEligible } from '@/lib/domaine/ordonnanceur';
import type {
  Couverture,
  CranOrientation,
  Evenement,
  Progression,
  Session,
  SujetSuivi,
} from '@/lib/domaine/types';

/**
 * Dépôt de démonstration — fixtures réalistes, aucune dépendance externe.
 *
 * Sert trois choses : rendre l'application sans infrastructure, alimenter la
 * revue de conception, et fournir un jeu de données stable pour comparer deux
 * ordonnanceurs sur la même entrée.
 */

const JOUR = 86_400_000;
const maintenant = () => Date.now();

function iso(deltaMs: number): string {
  return new Date(maintenant() + deltaMs).toISOString();
}

interface Graine {
  id: string;
  titre: string;
  amorce: string;
  editeurs: { id: string; nom: string; sigle: string }[];
  orientations: Partial<Record<CranOrientation, number>>;
  coutS: number;
  entreIlYaJours: number;
  dernierFaitIlYaH: number;
  statut: SujetSuivi['statut'];
  priorite?: number;
  rouvert?: boolean;
  reporteDans?: number;
  candidat?: number;
}

const GRAINES: Graine[] = [
  {
    id: 'sujet-plafond',
    titre: 'Révision du plafond d’émissions industrielles',
    amorce:
      'Onze médias couvrent le vote de jeudi. Deux rapporteurs contestent le calendrier d’application.',
    editeurs: [
      { id: 'ed-lm', nom: 'Le Monde', sigle: 'LM' },
      { id: 'ed-af', nom: 'AFP', sigle: 'AF' },
      { id: 'ed-ct', nom: 'Contexte', sigle: 'CT' },
    ],
    orientations: { [-3]: 1, [-2]: 2, [-1]: 1, 0: 3, 1: 2, 2: 1, 3: 1 },
    coutS: 180,
    entreIlYaJours: 1,
    dernierFaitIlYaH: 4,
    statut: 'nouveau',
    priorite: 2,
  },
  {
    id: 'sujet-obligataire',
    titre: 'Marché obligataire : reprise des adjudications',
    amorce: 'Six éditeurs, aucune divergence de fond sur les chiffres.',
    editeurs: [
      { id: 'ed-le', nom: 'Les Échos', sigle: 'LE' },
      { id: 'ed-re', nom: 'Reuters', sigle: 'RE' },
    ],
    orientations: { [-1]: 2, 0: 3, 1: 1 },
    coutS: 120,
    entreIlYaJours: 3,
    dernierFaitIlYaH: 20,
    statut: 'en_cours',
  },
  {
    id: 'sujet-energie',
    titre: 'Loi de programmation énergétique — arbitrage reporté',
    amorce:
      'Neuf éditeurs. L’écart de traitement entre les pôles est le plus marqué de la semaine.',
    editeurs: [
      { id: 'ed-ct', nom: 'Contexte', sigle: 'CT' },
      { id: 'ed-mp', nom: 'Mediapart', sigle: 'MP' },
    ],
    orientations: { [-3]: 2, [-2]: 1, 0: 2, 1: 2, 3: 2 },
    coutS: 240,
    entreIlYaJours: 11,
    dernierFaitIlYaH: 60,
    statut: 'en_cours',
  },
  {
    id: 'sujet-cerealier',
    titre: 'Accord céréalier — session de Genève',
    amorce: 'Rapprochement sous le seuil de confiance : deux événements possibles.',
    editeurs: [{ id: 'ed-re', nom: 'Reuters', sigle: 'RE' }],
    orientations: { [-1]: 1, 0: 3, 1: 1 },
    coutS: 60,
    entreIlYaJours: 2,
    dernierFaitIlYaH: 9,
    statut: 'nouveau',
    candidat: 0.64,
  },
  {
    id: 'sujet-semiconducteurs',
    titre: 'Semi-conducteurs : arbitrage sur l’extension de Crolles',
    amorce: 'Vous aviez demandé à revoir ce sujet aujourd’hui.',
    editeurs: [
      { id: 'ed-lt', nom: 'La Tribune', sigle: 'LT' },
      { id: 'ed-le', nom: 'Les Échos', sigle: 'LE' },
    ],
    orientations: { [-1]: 1, 0: 2, 1: 2, 2: 1 },
    coutS: 150,
    entreIlYaJours: 6,
    dernierFaitIlYaH: 40,
    statut: 'en_cours',
    reporteDans: -2 * 3_600_000,
  },
  {
    id: 'sujet-transport',
    titre: 'Fret ferroviaire : le rapport de la Cour des comptes',
    amorce: 'Fait nouveau tombé après votre clôture de mardi.',
    editeurs: [{ id: 'ed-lm', nom: 'Le Monde', sigle: 'LM' }],
    orientations: { [-2]: 1, 0: 2, 1: 1 },
    coutS: 90,
    entreIlYaJours: 5,
    dernierFaitIlYaH: 2,
    statut: 'rouvert',
    rouvert: true,
  },
];

const UTILISATEUR_DEMO_ABONNEMENTS = ['ed-lm', 'ed-af', 'ed-le', 'ed-lt'];

function versSujet(g: Graine): SujetSuivi {
  return {
    id: g.id,
    utilisateurId: 'demo',
    evenementId: `ev-${g.id}`,
    statut: g.statut,
    entreLe: iso(-g.entreIlYaJours * JOUR),
    boucleLe: g.statut === 'boucle' ? iso(-JOUR) : null,
    substanceAtteinte: g.statut === 'boucle',
    tempsConsommeS: g.statut === 'boucle' ? 210 : 0,
    origine: 'abonnement',
    reporteAu: g.reporteDans !== undefined ? iso(g.reporteDans) : null,
    nbReports: g.reporteDans !== undefined ? 1 : 0,
  };
}

function versEvenement(g: Graine): Evenement {
  return {
    id: `ev-${g.id}`,
    titreCanonique: g.titre,
    apparuLe: iso(-g.entreIlYaJours * JOUR),
    dernierFaitLe: iso(-g.dernierFaitIlYaH * 3_600_000),
    vivacite: g.dernierFaitIlYaH < 12 ? 'chaud' : g.dernierFaitIlYaH < 48 ? 'actif' : 'stabilise',
  };
}

function versCouverture(g: Graine): Couverture {
  const complet: Record<CranOrientation, number> = {
    [-3]: 0, [-2]: 0, [-1]: 0, 0: 0, 1: 0, 2: 0, 3: 0,
    ...g.orientations,
  } as Record<CranOrientation, number>;
  const nb = Object.values(complet).reduce((s, n) => s + n, 0);
  return {
    evenementId: `ev-${g.id}`,
    nbEditeurs: nb,
    repartitionOrientations: complet,
    // Le corpus réel dépasse les éditeurs affichés : c'est ce qui crée
    // l'angle mort. On ne montre que ceux que l'utilisateur suit.
    editeursIds: g.editeurs.map((e) => e.id),
  };
}

function versAffichable(g: Graine): SujetAffichable {
  return {
    sujet: versSujet(g),
    evenement: versEvenement(g),
    couverture: versCouverture(g),
    editeurs: g.editeurs,
    amorce: g.amorce,
    coutEstimeS: g.coutS,
    rapprochementNonConfirme:
      g.candidat !== undefined
        ? { rattachementId: `rat-${g.id}`, confiance: g.candidat }
        : null,
  };
}

export class DepotDemo implements Depot {
  readonly nom = 'demo';

  async sessionCourante(utilisateurId: string): Promise<Session | null> {
    return {
      id: 'session-demo',
      utilisateurId,
      budgetDeclareS: 600,
      tempsReelS: 228,
      issue: null,
      repriseApresAbsence: false,
      ouverteLe: iso(-228_000),
    };
  }

  async sujetsEligibles(): Promise<readonly SujetEligible[]> {
    return GRAINES.filter((g) => g.statut !== 'boucle' && g.statut !== 'ecarte').map((g) => ({
      sujet: versSujet(g),
      coutEstimeS: g.coutS,
      dernierFaitLe: versEvenement(g).dernierFaitLe,
      reouvertParJalon: g.rouvert ?? false,
      prioriteSource: g.priorite ?? 0,
    }));
  }

  async sujetsAffichables(
    _utilisateurId: string,
    sujetIds: readonly string[],
  ): Promise<readonly SujetAffichable[]> {
    const parId = new Map(GRAINES.map((g) => [g.id, g]));
    return sujetIds
      .map((id) => parId.get(id))
      .filter((g): g is Graine => g !== undefined)
      .map(versAffichable);
  }

  async inventaire(
    _utilisateurId: string,
    statut: SujetSuivi['statut'],
  ): Promise<readonly SujetAffichable[]> {
    return GRAINES.filter((g) => g.statut === statut).map(versAffichable);
  }

  async progressions(): Promise<readonly Progression[]> {
    return [];
  }

  async editeursAbonnesIds(): Promise<readonly string[]> {
    return UTILISATEUR_DEMO_ABONNEMENTS;
  }
}
