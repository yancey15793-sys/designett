import { describe, expect, it } from 'vitest';
import {
  compteDansNsm,
  delaiDeClotureJours,
  detteInformationnelleJours,
  estBoucle,
  substanceAtteinte,
} from './nsm';
import { OrdonnanceurV0, type SujetEligible } from './ordonnanceur';
import { angleMortPersonnel, pluraliteAtteinte, segmentsPanorama } from './panorama';
import { evaluerSynthese } from './synthese';
import type { Couverture, Progression, SujetSuivi, Synthese } from './types';

const JOUR = 86_400_000;
const T0 = new Date('2026-08-17T09:00:00Z');

function sujet(p: Partial<SujetSuivi> = {}): SujetSuivi {
  return {
    id: 's1',
    utilisateurId: 'u1',
    evenementId: 'e1',
    statut: 'en_cours',
    entreLe: new Date(T0.getTime() - 2 * JOUR).toISOString(),
    boucleLe: null,
    substanceAtteinte: false,
    tempsConsommeS: 0,
    origine: 'abonnement',
    reporteAu: null,
    nbReports: 0,
    ...p,
  };
}

function prog(p: Partial<Progression> = {}): Progression {
  return {
    id: 'p1',
    sujetSuiviId: 's1',
    itemId: 'i1',
    ancrageCanonique: { bloc: 0, decalage: 0 },
    tauxCompletion: 0,
    secondesActives: 0,
    modaliteDerniere: 'texte',
    majLe: T0.toISOString(),
    ...p,
  };
}

describe('substance', () => {
  it('est atteinte par le taux de complétion en texte', () => {
    expect(substanceAtteinte([prog({ tauxCompletion: 0.71 })])).toBe(true);
  });

  it('est atteinte par le temps actif même si le taux est bas', () => {
    expect(
      substanceAtteinte([prog({ tauxCompletion: 0.1, secondesActives: 95 })]),
    ).toBe(true);
  });

  it("applique le seuil audio, plus permissif en taux mais plus exigeant en durée", () => {
    const audio = { modaliteDerniere: 'audio_synthese' as const };
    expect(substanceAtteinte([prog({ ...audio, tauxCompletion: 0.62 })])).toBe(true);
    expect(
      substanceAtteinte([prog({ ...audio, tauxCompletion: 0.1, secondesActives: 120 })]),
    ).toBe(false);
  });

  it('un survol ne compte pas', () => {
    expect(
      substanceAtteinte([prog({ tauxCompletion: 0.2, secondesActives: 12 })]),
    ).toBe(false);
  });
});

describe('bouclé vs compté dans la NSM — la confusion à ne jamais faire', () => {
  const tardif = sujet({
    statut: 'boucle',
    entreLe: new Date(T0.getTime() - 20 * JOUR).toISOString(),
    boucleLe: T0.toISOString(),
  });

  it('reste bouclé au-delà de la fenêtre de fraîcheur', () => {
    expect(estBoucle(tardif)).toBe(true);
    expect(delaiDeClotureJours(tardif)).toBeCloseTo(20, 5);
  });

  it("n'est pas compté dans la NSM pour autant", () => {
    expect(compteDansNsm(tardif, [prog({ tauxCompletion: 0.9 })])).toBe(false);
  });

  it('est compté quand les trois conditions sont réunies', () => {
    const frais = sujet({
      statut: 'boucle',
      entreLe: new Date(T0.getTime() - 2 * JOUR).toISOString(),
      boucleLe: T0.toISOString(),
    });
    expect(compteDansNsm(frais, [prog({ tauxCompletion: 0.9 })])).toBe(true);
  });

  it("n'est jamais compté sans substance, même bouclé et frais", () => {
    const frais = sujet({
      statut: 'boucle',
      entreLe: new Date(T0.getTime() - 1 * JOUR).toISOString(),
      boucleLe: T0.toISOString(),
    });
    expect(compteDansNsm(frais, [prog({ tauxCompletion: 0.05 })])).toBe(false);
  });

  it('un sujet écarté ne compte pas — clore sans lire ne remplit pas la métrique', () => {
    expect(compteDansNsm(sujet({ statut: 'ecarte' }), [prog({ tauxCompletion: 1 })])).toBe(false);
  });
});

describe('dette informationnelle', () => {
  it("ne compte que ce qui n'est ni bouclé ni écarté", () => {
    const s = [
      sujet({ id: 'a', entreLe: new Date(T0.getTime() - 4 * JOUR).toISOString() }),
      sujet({ id: 'b', entreLe: new Date(T0.getTime() - 10 * JOUR).toISOString() }),
      sujet({ id: 'c', statut: 'boucle', boucleLe: T0.toISOString() }),
    ];
    expect(detteInformationnelleJours(s, T0)).toBeCloseTo(7, 1);
  });

  it('vaut null quand la file est vide — le vide est un résultat, pas un zéro', () => {
    expect(detteInformationnelleJours([], T0)).toBeNull();
  });
});

describe('ordonnanceur v0', () => {
  const o = new OrdonnanceurV0();

  function elig(p: {
    id: string;
    sujet?: Partial<SujetSuivi>;
    coutEstimeS?: number;
    dernierFaitLe?: string;
    reouvertParJalon?: boolean;
    prioriteSource?: number;
  }): SujetEligible {
    return {
      sujet: sujet({ id: p.id, ...(p.sujet ?? {}) }),
      coutEstimeS: p.coutEstimeS ?? 120,
      dernierFaitLe: p.dernierFaitLe ?? T0.toISOString(),
      reouvertParJalon: p.reouvertParJalon ?? false,
      prioriteSource: p.prioriteSource ?? 0,
    };
  }

  it('O2 — la somme des coûts ne dépasse jamais le budget', () => {
    const file = o.ordonner(
      [elig({ id: 'a' }), elig({ id: 'b' }), elig({ id: 'c' }), elig({ id: 'd' })],
      { budgetS: 300, maintenant: T0 },
    );
    expect(file.coutTotalS).toBeLessThanOrEqual(300);
    expect(file.entrees).toHaveLength(2);
    expect(file.nonRetenus).toHaveLength(2);
  });

  it('O2 — comble la place restante au lieu de s’arrêter au premier trop gros', () => {
    const file = o.ordonner(
      [
        elig({ id: 'gros', coutEstimeS: 600, prioriteSource: 3 }),
        elig({ id: 'petit', coutEstimeS: 60 }),
      ],
      { budgetS: 300, maintenant: T0 },
    );
    expect(file.entrees.map((e) => e.sujetId)).toEqual(['petit']);
    expect(file.nonRetenus).toEqual(['gros']);
  });

  it('O3 — déterministe : deux appels sur le même état donnent le même ordre', () => {
    const entree = [elig({ id: 'a' }), elig({ id: 'b' }), elig({ id: 'c' })];
    const un = o.ordonner(entree, { budgetS: 600, maintenant: T0 });
    const deux = o.ordonner(entree, { budgetS: 600, maintenant: T0 });
    expect(un.entrees.map((e) => e.sujetId)).toEqual(deux.entrees.map((e) => e.sujetId));
  });

  it('O4 — chaque entrée porte une justification affichable', () => {
    const file = o.ordonner([elig({ id: 'a' })], { budgetS: 600, maintenant: T0 });
    for (const e of file.entrees) {
      expect(e.pourquoi.phrase.length).toBeGreaterThan(0);
      expect(e.pourquoi.facteur).toBeTruthy();
    }
  });

  it('un report échu passe devant tout le reste — c’est une promesse tenue', () => {
    const file = o.ordonner(
      [
        elig({ id: 'chaud', dernierFaitLe: T0.toISOString(), prioriteSource: 3 }),
        elig({
          id: 'promis',
          sujet: { reporteAu: new Date(T0.getTime() - JOUR).toISOString() },
        }),
      ],
      { budgetS: 600, maintenant: T0 },
    );
    expect(file.entrees[0]!.sujetId).toBe('promis');
    expect(file.entrees[0]!.pourquoi.facteur).toBe('report_echu');
  });

  it('une réouverture remonte : le monde a changé', () => {
    const file = o.ordonner(
      [elig({ id: 'ordinaire' }), elig({ id: 'rouvert', reouvertParJalon: true })],
      { budgetS: 600, maintenant: T0 },
    );
    expect(file.entrees[0]!.sujetId).toBe('rouvert');
  });

  it('la dette évite la famine : ce qui attend depuis longtemps remonte', () => {
    const file = o.ordonner(
      [
        elig({ id: 'neuf', sujet: { entreLe: T0.toISOString() } }),
        elig({
          id: 'vieux',
          sujet: { entreLe: new Date(T0.getTime() - 12 * JOUR).toISOString() },
        }),
      ],
      { budgetS: 600, maintenant: T0 },
    );
    expect(file.entrees[0]!.sujetId).toBe('vieux');
  });
});

describe('panorama', () => {
  const couverture: Couverture = {
    evenementId: 'e1',
    nbEditeurs: 10,
    repartitionOrientations: { [-3]: 1, [-2]: 2, [-1]: 1, 0: 3, 1: 2, 2: 1, 3: 0 },
    editeursIds: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'],
  };

  it('calcule l’angle mort sur les sources de l’utilisateur, pas sur un corpus maison', () => {
    expect(angleMortPersonnel(couverture, ['e1', 'e2'])).toBeCloseTo(0.8, 5);
    expect(angleMortPersonnel(couverture, couverture.editeursIds)).toBeCloseTo(0, 5);
  });

  it('exige au moins deux orientations distinctes pour la pluralité', () => {
    expect(pluraliteAtteinte([0, 0, 0])).toBe(false);
    expect(pluraliteAtteinte([-2, 1])).toBe(true);
  });

  it('marque pour étiquetage direct les segments d’au moins 8 %', () => {
    const segs = segmentsPanorama(couverture);
    expect(segs.every((s) => s.part > 0)).toBe(true);
    expect(segs.find((s) => s.cran === 0)!.etiqueteDirectement).toBe(true);
  });
});

describe('servabilité d’une synthèse — R8', () => {
  const base = { id: 'sy1', evenementId: 'e1', dureeCible: '3min', registre: 'neutre', langue: 'fr' } as const;

  it('sert une synthèse dont chaque assertion est citée et résolvable', () => {
    const s: Synthese = {
      ...base,
      assertions: [
        {
          id: 'a1',
          rang: 1,
          enonce: 'Le plafond est relevé de 12 %.',
          citations: [{ id: 'c1', assertionId: 'a1', itemId: 'i1', ancrage: { bloc: 3, decalage: 0 } }],
        },
      ],
    };
    expect(evaluerSynthese(s, new Set(['i1'])).servable).toBe(true);
  });

  it('refuse de servir dès qu’une assertion perd sa dernière citation', () => {
    const s: Synthese = {
      ...base,
      assertions: [{ id: 'a1', rang: 1, enonce: 'Orpheline.', citations: [] }],
    };
    const etat = evaluerSynthese(s, new Set(['i1']));
    expect(etat.servable).toBe(false);
    if (!etat.servable) expect(etat.raison).toBe('assertion_sans_citation');
  });

  it('refuse de servir si la source citée a disparu du corpus', () => {
    const s: Synthese = {
      ...base,
      assertions: [
        {
          id: 'a1',
          rang: 1,
          enonce: 'Citée, mais introuvable.',
          citations: [{ id: 'c1', assertionId: 'a1', itemId: 'disparu', ancrage: { bloc: 1, decalage: 0 } }],
        },
      ],
    };
    const etat = evaluerSynthese(s, new Set(['i1']));
    expect(etat.servable).toBe(false);
    if (!etat.servable) expect(etat.raison).toBe('citation_irresolvable');
  });
});
