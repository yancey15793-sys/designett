import 'server-only';

import type {
  Couverture,
  Evenement,
  Progression,
  Session,
  SujetSuivi,
} from '@/lib/domaine/types';
import type { SujetEligible } from '@/lib/domaine/ordonnanceur';

/**
 * Frontière d'accès aux données.
 *
 * L'application ne connaît QUE cette interface. Supabase est une
 * implémentation, pas une dépendance : c'est ce qui permet de rendre les
 * écrans, d'exécuter les tests et de faire tourner l'application sans
 * fournisseur — et ce qui rendrait un changement de fournisseur local à un
 * seul fichier.
 */

export interface SujetAffichable {
  readonly sujet: SujetSuivi;
  readonly evenement: Evenement;
  readonly couverture: Couverture;
  readonly editeurs: readonly { id: string; nom: string; sigle: string }[];
  readonly amorce: string;
  readonly coutEstimeS: number;
  /** A4 — présent uniquement si un rattachement reste sous le seuil. */
  readonly rapprochementNonConfirme: { rattachementId: string; confiance: number } | null;
}

export interface Depot {
  readonly nom: string;
  sessionCourante(utilisateurId: string): Promise<Session | null>;
  sujetsEligibles(utilisateurId: string): Promise<readonly SujetEligible[]>;
  sujetsAffichables(
    utilisateurId: string,
    sujetIds: readonly string[],
  ): Promise<readonly SujetAffichable[]>;
  inventaire(
    utilisateurId: string,
    statut: SujetSuivi['statut'],
  ): Promise<readonly SujetAffichable[]>;
  progressions(utilisateurId: string): Promise<readonly Progression[]>;
  editeursAbonnesIds(utilisateurId: string): Promise<readonly string[]>;
}

/**
 * Sélection de l'implémentation.
 *
 * Sans variables d'environnement Supabase, l'application démarre sur des
 * fixtures. Ce n'est pas un mode dégradé de confort : c'est ce qui garantit
 * qu'un écran reste rendu — et donc revu — même quand l'infrastructure n'est
 * pas provisionnée.
 */
export async function obtenirDepot(): Promise<Depot> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && cle) {
    const { DepotSupabase } = await import('./depot-supabase');
    return new DepotSupabase();
  }
  const { DepotDemo } = await import('./depot-demo');
  return new DepotDemo();
}
