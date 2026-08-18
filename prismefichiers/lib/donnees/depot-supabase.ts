import 'server-only';

import { clientServeur } from '@/lib/supabase/serveur';
import type { Depot, SujetAffichable } from './depot';
import type { SujetEligible } from '@/lib/domaine/ordonnanceur';
import type {
  Couverture,
  CranOrientation,
  Progression,
  Session,
  SujetSuivi,
} from '@/lib/domaine/types';

/**
 * Implémentation Supabase.
 *
 * Le mapping snake_case → camelCase est fait ici et nulle part ailleurs : le
 * domaine ne doit jamais voir la forme de la base. C'est ce qui permet de
 * faire évoluer le schéma sans toucher aux règles métier.
 */

type Ligne = Record<string, unknown>;

function versSujetSuivi(l: Ligne): SujetSuivi {
  return {
    id: String(l.id),
    utilisateurId: String(l.utilisateur_id),
    evenementId: String(l.evenement_id),
    statut: l.statut as SujetSuivi['statut'],
    entreLe: String(l.entre_le),
    boucleLe: l.boucle_le ? String(l.boucle_le) : null,
    substanceAtteinte: Boolean(l.substance_atteinte),
    tempsConsommeS: Number(l.temps_consomme_s ?? 0),
    origine: l.origine as SujetSuivi['origine'],
    reporteAu: l.reporte_au ? String(l.reporte_au) : null,
    nbReports: Number(l.nb_reports ?? 0),
  };
}

const CRANS: CranOrientation[] = [-3, -2, -1, 0, 1, 2, 3];

function versCouverture(l: Ligne): Couverture {
  const brut = (l.repartition_orientations ?? {}) as Record<string, number>;
  const repartition = Object.fromEntries(
    CRANS.map((c) => [c, Number(brut[String(c)] ?? 0)]),
  ) as Record<CranOrientation, number>;
  return {
    evenementId: String(l.evenement_id),
    nbEditeurs: Number(l.nb_editeurs ?? 0),
    repartitionOrientations: repartition,
    editeursIds: (l.editeurs_ids as string[] | null) ?? [],
  };
}

/** Sélection unique : le coût d'une jointure mal découpée se paie à chaque rendu. */
const SELECTION_SUJET = `
  id, utilisateur_id, evenement_id, statut, entre_le, boucle_le,
  substance_atteinte, temps_consomme_s, origine, reporte_au, nb_reports,
  evenement:evenement_id (
    id, titre_canonique, apparu_le, dernier_fait_le, vivacite,
    couverture ( evenement_id, nb_editeurs, repartition_orientations, editeurs_ids ),
    rattachement ( id, confiance, statut )
  )
`;

export class DepotSupabase implements Depot {
  readonly nom = 'supabase';

  async sessionCourante(utilisateurId: string): Promise<Session | null> {
    const sb = await clientServeur();
    const { data } = await sb
      .from('session')
      .select('*')
      .eq('utilisateur_id', utilisateurId)
      .is('scellee_le', null)
      .order('ouverte_le', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return null;
    const l = data as Ligne;
    return {
      id: String(l.id),
      utilisateurId: String(l.utilisateur_id),
      budgetDeclareS: Number(l.budget_declare_s),
      tempsReelS: Number(l.temps_reel_s ?? 0),
      issue: (l.issue as Session['issue']) ?? null,
      repriseApresAbsence: Boolean(l.reprise_apres_absence),
      ouverteLe: String(l.ouverte_le),
    };
  }

  async sujetsEligibles(utilisateurId: string): Promise<readonly SujetEligible[]> {
    const sb = await clientServeur();
    const { data } = await sb
      .from('sujet_suivi')
      .select(SELECTION_SUJET)
      .eq('utilisateur_id', utilisateurId)
      .in('statut', ['nouveau', 'en_cours', 'rouvert']);

    return (data ?? []).map((brut) => {
      const l = brut as Ligne;
      const ev = (l.evenement ?? {}) as Ligne;
      return {
        sujet: versSujetSuivi(l),
        // Estimation par défaut tant que le calcul de coût n'est pas branché
        // sur les renditions. Documenté comme provisoire, pas caché.
        coutEstimeS: 120,
        dernierFaitLe: String(ev.dernier_fait_le ?? l.entre_le),
        reouvertParJalon: l.statut === 'rouvert',
        prioriteSource: 0,
      };
    });
  }

  async sujetsAffichables(
    utilisateurId: string,
    sujetIds: readonly string[],
  ): Promise<readonly SujetAffichable[]> {
    if (sujetIds.length === 0) return [];
    const sb = await clientServeur();
    const { data } = await sb
      .from('sujet_suivi')
      .select(SELECTION_SUJET)
      .eq('utilisateur_id', utilisateurId)
      .in('id', [...sujetIds]);

    const parId = new Map(
      (data ?? []).map((brut) => {
        const l = brut as Ligne;
        return [String(l.id), l] as const;
      }),
    );
    // On respecte l'ordre demandé : c'est l'ordonnanceur qui l'a produit,
    // pas la base. Laisser Postgres décider casserait O3.
    return sujetIds
      .map((id) => parId.get(id))
      .filter((l): l is Ligne => l !== undefined)
      .map((l) => this.assembler(l));
  }

  async inventaire(
    utilisateurId: string,
    statut: SujetSuivi['statut'],
  ): Promise<readonly SujetAffichable[]> {
    const sb = await clientServeur();
    const { data } = await sb
      .from('sujet_suivi')
      .select(SELECTION_SUJET)
      .eq('utilisateur_id', utilisateurId)
      .eq('statut', statut)
      .order('entre_le', { ascending: false })
      .limit(50); // Pagination explicite — jamais de défilement infini.

    return (data ?? []).map((brut) => this.assembler(brut as Ligne));
  }

  async progressions(utilisateurId: string): Promise<readonly Progression[]> {
    const sb = await clientServeur();
    const { data } = await sb
      .from('progression')
      .select('*')
      .eq('utilisateur_id', utilisateurId);

    return (data ?? []).map((brut) => {
      const l = brut as Ligne;
      return {
        id: String(l.id),
        sujetSuiviId: String(l.sujet_suivi_id),
        itemId: String(l.item_id),
        ancrageCanonique: l.ancrage_canonique as Progression['ancrageCanonique'],
        tauxCompletion: Number(l.taux_completion ?? 0),
        secondesActives: Number(l.secondes_actives ?? 0),
        modaliteDerniere: l.modalite_derniere as Progression['modaliteDerniere'],
        majLe: String(l.maj_le),
      };
    });
  }

  async editeursAbonnesIds(utilisateurId: string): Promise<readonly string[]> {
    const sb = await clientServeur();
    const { data } = await sb
      .from('abonnement')
      .select('source:source_id (editeur_id)')
      .eq('utilisateur_id', utilisateurId);

    const ids = new Set<string>();
    for (const brut of data ?? []) {
      const s = (brut as Ligne).source as Ligne | null;
      if (s?.editeur_id) ids.add(String(s.editeur_id));
    }
    return [...ids];
  }

  private assembler(l: Ligne): SujetAffichable {
    const ev = (l.evenement ?? {}) as Ligne;
    const couvBrute = Array.isArray(ev.couverture) ? ev.couverture[0] : ev.couverture;
    const rattachements = (ev.rattachement ?? []) as Ligne[];
    const candidat = rattachements.find((r) => r.statut === 'candidat');

    return {
      sujet: versSujetSuivi(l),
      evenement: {
        id: String(ev.id ?? l.evenement_id),
        titreCanonique: String(ev.titre_canonique ?? ''),
        apparuLe: String(ev.apparu_le ?? l.entre_le),
        dernierFaitLe: String(ev.dernier_fait_le ?? l.entre_le),
        vivacite: (ev.vivacite as 'chaud' | 'actif' | 'stabilise' | 'clos') ?? 'actif',
      },
      couverture: couvBrute
        ? versCouverture(couvBrute as Ligne)
        : {
            evenementId: String(l.evenement_id),
            nbEditeurs: 0,
            repartitionOrientations: Object.fromEntries(
              CRANS.map((c) => [c, 0]),
            ) as Record<CranOrientation, number>,
            editeursIds: [],
          },
      editeurs: [],
      amorce: '',
      coutEstimeS: 120,
      rapprochementNonConfirme: candidat
        ? { rattachementId: String(candidat.id), confiance: Number(candidat.confiance) }
        : null,
    };
  }
}
