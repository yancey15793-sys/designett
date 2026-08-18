import { cn } from '@/lib/utils';

/**
 * L'UNIQUE compteur du produit — et il décroît (règle S4).
 *
 * L'API n'accepte que `restantS` et `budgetS`. Il est structurellement
 * impossible d'afficher « 4 sur 10 » avec ce composant : c'est la règle
 * traduite en signature de fonction plutôt qu'en revue de code.
 *
 * Budget dépassé : la jauge reste à zéro. Aucun rouge, aucune notion de
 * retard — le job émotionnel E1 interdit de reprocher une lenteur.
 */
export function JaugeSession({
  restantS,
  budgetS,
  sujetsRestants,
  className,
}: {
  restantS: number;
  budgetS: number;
  sujetsRestants: number;
  className?: string;
}) {
  const restant = Math.max(0, restantS);
  const part = budgetS > 0 ? Math.min(1, restant / budgetS) : 0;
  const min = Math.max(0, Math.round(restant / 60));

  return (
    <div
      className={cn(
        'flex items-center gap-3.5 rounded-l border border-filet bg-surface p-4',
        className,
      )}
    >
      <div
        className="grid size-11 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--color-iris) 0 ${part * 100}%, var(--color-n-200) ${part * 100}% 100%)`,
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={budgetS}
        aria-valuenow={restant}
        aria-valuetext={`${min} minutes restantes`}
      >
        <span className="grid size-[35px] place-items-center rounded-full bg-surface font-donnees text-[11px] font-semibold">
          {min}′
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <b className="block text-[15px] font-semibold tracking-[-0.008em]">
          {min} min restantes
        </b>
        <span className="mt-px block text-[12.5px] text-encre-3">
          {sujetsRestants} sujet{sujetsRestants > 1 ? 's' : ''} · puis c’est tout
        </span>
        <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-n-200">
          <div
            className="h-full rounded-full bg-iris"
            style={{ width: `${part * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
