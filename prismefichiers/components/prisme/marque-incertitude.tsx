import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A4 — un rattachement sous le seuil n'est JAMAIS présenté comme fusionné.
 *
 * Texture, pas couleur (règle S3). Un jaune d'alerte dirait « anomalie » ;
 * or le système fait exactement son travail en refusant de fusionner. La
 * hachure dit « lien non consolidé » sans échelle de gravité.
 *
 * Le libellé est obligatoire dans l'API : la texture n'est jamais seule
 * porteuse d'information.
 */
export function MarqueIncertitude({
  children,
  libelle = 'Rapproché — non confirmé',
  className,
}: {
  children: ReactNode;
  libelle?: string;
  className?: string;
}) {
  return (
    <div className={cn('marque-incertitude rounded-l', className)}>
      <div className="-m-px rounded-[15px] bg-surface p-4">
        <p className="sr-only">
          Rapprochement non confirmé. Le système n’a pas fusionné ces éléments.
        </p>
        {children}
        <p className="mt-2 text-[11.5px] text-encre-2">{libelle}</p>
      </div>
    </div>
  );
}
