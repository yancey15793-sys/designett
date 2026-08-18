import Link from 'next/link';
import { CarteSujet } from '@/components/prisme/carte-sujet';
import { obtenirDepot } from '@/lib/donnees/depot';
import type { StatutSujet } from '@/lib/domaine/types';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const UTILISATEUR_DEMO = 'demo';

const SEGMENTS: { statut: StatutSujet; libelle: string }[] = [
  { statut: 'nouveau', libelle: 'Nouveaux' },
  { statut: 'en_cours', libelle: 'En cours' },
  { statut: 'boucle', libelle: 'Bouclés' },
  { statut: 'rouvert', libelle: 'Rouverts' },
];

/**
 * « Sujets » — l'inventaire.
 *
 * Ce n'est PAS un flux : la décision A2 supprime toute vue chronologique
 * « tous les articles ». Une rangée = un sujet, jamais un article ; le
 * nombre d'éditeurs remplace ce qu'un lecteur RSS afficherait comme autant
 * de lignes.
 *
 * Pagination explicite, jamais de défilement infini — c'est l'endroit du
 * produit où il serait le plus tentant, et celui où il casserait la promesse
 * de finitude.
 */
export default async function PageSujets({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const params = await searchParams;
  const actif = (SEGMENTS.find((s) => s.statut === params.statut)?.statut ??
    'en_cours') as StatutSujet;

  const depot = await obtenirDepot();
  const sujets = await depot.inventaire(UTILISATEUR_DEMO, actif);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center gap-3.5">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Sujets</h1>
        <nav aria-label="Filtrer par statut" className="flex gap-0.5 rounded-full bg-enfonce p-[3px]">
          {SEGMENTS.map((s) => (
            <Link
              key={s.statut}
              href={{ pathname: '/sujets', query: { statut: s.statut } }}
              aria-current={s.statut === actif ? 'page' : undefined}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-encre-2 transition-colors',
                s.statut === actif && 'bg-surface font-semibold text-encre shadow-sm',
              )}
            >
              {s.libelle}
            </Link>
          ))}
        </nav>
      </div>

      {sujets.length === 0 ? (
        <p className="rounded-l border border-filet bg-surface p-8 text-center text-sm text-encre-3">
          Aucun sujet dans ce filtre.
        </p>
      ) : (
        <>
          {sujets.map((d) => (
            <CarteSujet key={d.sujet.id} donnees={d} dense />
          ))}
          <p className="mt-4 text-center text-xs text-encre-4">
            {sujets.length} sujet{sujets.length > 1 ? 's' : ''} affiché
            {sujets.length > 1 ? 's' : ''} · pagination explicite
          </p>
        </>
      )}
    </div>
  );
}
