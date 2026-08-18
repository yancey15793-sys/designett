import { CarteSujet } from '@/components/prisme/carte-sujet';
import { JaugeSession } from '@/components/prisme/jauge-session';
import { obtenirDepot } from '@/lib/donnees/depot';
import { ordonnanceurParDefaut } from '@/lib/domaine/ordonnanceur';

export const dynamic = 'force-dynamic';

const UTILISATEUR_DEMO = 'demo';

/**
 * « Aujourd’hui » — la destination par défaut.
 *
 * Server Component : la file est construite sur le serveur, à partir du
 * domaine pur. Aucun état client n'est nécessaire pour afficher un briefing,
 * et l'ordre est ainsi le même pour tout le monde (O3).
 *
 * O2 est tenu ICI, à la construction : la file est bornée par le budget au
 * moment où on la remplit. Elle n'est jamais tronquée à l'affichage — ce qui
 * n'entre pas n'est pas caché, il n'est simplement pas de cette session.
 */
export default async function PageAujourdhui() {
  const depot = await obtenirDepot();
  const session = await depot.sessionCourante(UTILISATEUR_DEMO);
  const eligibles = await depot.sujetsEligibles(UTILISATEUR_DEMO);

  const budgetS = session?.budgetDeclareS ?? 600;
  const file = ordonnanceurParDefaut.ordonner(eligibles, {
    budgetS,
    maintenant: new Date(),
  });

  const affichables = await depot.sujetsAffichables(
    UTILISATEUR_DEMO,
    file.entrees.map((e) => e.sujetId),
  );
  const justifications = new Map(
    file.entrees.map((e) => [e.sujetId, e.pourquoi.phrase]),
  );

  const consommeS = session?.tempsReelS ?? 0;
  const restantS = Math.max(0, budgetS - consommeS);

  // Le vide est le RÉSULTAT ATTENDU, pas un cas d'erreur.
  if (affichables.length === 0) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <b className="mb-1.5 block text-2xl font-semibold tracking-[-0.02em]">
          C’est tout.
        </b>
        <span className="text-[15px] text-encre-2">Rien en attente.</span>
        <small className="mt-7 block text-[12.5px] leading-relaxed text-encre-4">
          Rien ne se recharge.
          <br />
          Aucun trophée, aucune série à entretenir.
        </small>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-[28px] font-bold leading-[1.15] tracking-[-0.022em]">
        Aujourd’hui
      </h1>

      <JaugeSession
        restantS={restantS}
        budgetS={budgetS}
        sujetsRestants={affichables.length}
        className="mb-4"
      />

      {affichables.map((d) => (
        <CarteSujet
          key={d.sujet.id}
          donnees={d}
          pourquoi={justifications.get(d.sujet.id)}
        />
      ))}

      {/* Terminaison explicite : « fin de la file » est un élément dessiné,
          pas une absence d'éléments. Rien ne se charge en dessous. */}
      <p className="mt-3.5 text-center text-xs text-encre-4">Fin de la file</p>

      {file.nonRetenus.length > 0 ? (
        <p className="mt-2 text-center text-[11.5px] text-encre-4">
          {file.nonRetenus.length} sujet{file.nonRetenus.length > 1 ? 's' : ''} au-delà de
          votre budget — pour une prochaine session, jamais présentés comme un retard.
        </p>
      ) : null}
    </div>
  );
}
