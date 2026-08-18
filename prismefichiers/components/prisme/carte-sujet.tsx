import { Button } from '@/components/ui/button';
import { Etiquette } from '@/components/ui/etiquette';
import { BarrePanorama } from './barre-panorama';
import { MarqueIncertitude } from './marque-incertitude';
import type { SujetAffichable } from '@/lib/donnees/depot';
import { cn, minutes } from '@/lib/utils';

const VIVACITE: Record<string, string> = {
  chaud: 'Chaud',
  actif: 'Actif',
  stabilise: 'Stabilisé',
  clos: 'Clos',
};

/**
 * Carte Sujet — l'objet le plus important du produit.
 *
 * Trois zones, ordre invariable (boucle 3 §5.1). Le minutage vient du coût
 * estimé : c'est le SEUL chiffre de la carte. Aucune pastille de non-lus,
 * et l'API n'en accepte pas.
 *
 * Un sujet bouclé RECULE — encre secondaire, filet atténué, aucune couleur.
 * La clôture est un apaisement, pas un point marqué.
 */
export function CarteSujet({
  donnees,
  pourquoi,
  dense = false,
}: {
  donnees: SujetAffichable;
  pourquoi?: string;
  dense?: boolean;
}) {
  const { sujet, evenement, couverture, editeurs, amorce, coutEstimeS } = donnees;
  const boucle = sujet.statut === 'boucle';

  const corps = (
    <>
      <div className="mb-2.5 flex items-center gap-1.5">
        {editeurs.slice(0, 3).map((e) => (
          <span
            key={e.id}
            className="grid size-6 shrink-0 place-items-center rounded-[7px] border border-filet bg-enfonce text-[9px] font-bold text-encre-3"
            title={e.nom}
          >
            {e.sigle}
          </span>
        ))}
        {couverture.nbEditeurs > editeurs.length ? (
          <span className="grid size-6 shrink-0 place-items-center rounded-[7px] border border-filet bg-enfonce text-[9px] font-bold text-encre-3">
            +{couverture.nbEditeurs - editeurs.length}
          </span>
        ) : null}
        <span className="text-xs text-encre-3">{VIVACITE[evenement.vivacite]}</span>
        <span className="ml-auto font-donnees text-[12.5px] text-encre-3">
          {minutes(coutEstimeS)}
        </span>
      </div>

      <h3
        className={cn(
          'mb-1.5 text-pretty text-[18px] font-semibold leading-[1.28] tracking-[-0.012em]',
          boucle && 'font-medium text-encre-2',
          dense && 'truncate text-base',
        )}
      >
        {sujet.statut === 'boucle' ? '✓ ' : ''}
        {evenement.titreCanonique}
      </h3>

      {!dense && amorce ? (
        <p
          className={cn(
            'mb-3.5 text-[14.5px] leading-[1.45] text-encre-2',
            boucle && 'text-encre-3',
          )}
        >
          {amorce}
        </p>
      ) : null}

      {!boucle ? <BarrePanorama couverture={couverture} compact /> : null}

      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        <Etiquette statut={sujet.statut} />
        {/* O4 — chaque entrée sait dire pourquoi elle est là. */}
        {pourquoi ? (
          <span className="text-[11.5px] text-encre-3">{pourquoi}</span>
        ) : null}
        <span className="ml-auto text-xs text-encre-3">
          {couverture.nbEditeurs} éditeurs
        </span>
      </div>
    </>
  );

  if (donnees.rapprochementNonConfirme) {
    return (
      <MarqueIncertitude className="mb-3">
        {corps}
        <div className="mt-3 flex gap-2">
          <Button taille="s" variante="secondaire">
            Confirmer
          </Button>
          <Button taille="s" variante="discret">
            Séparer
          </Button>
        </div>
      </MarqueIncertitude>
    );
  }

  return (
    <article
      className={cn(
        'mb-3 rounded-l border bg-surface p-[18px] transition-colors duration-[220ms]',
        boucle ? 'border-enfonce' : 'border-filet hover:border-n-200',
      )}
    >
      {corps}
    </article>
  );
}
