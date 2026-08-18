import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Coquille de navigation — les QUATRE destinations de la boucle 2, dans un
 * ordre figé.
 *
 * Aucune pastille, aucun compteur (règle S4 / décision A7). Le composant
 * n'accepte pas de prop `badge` : la règle est dans la structure, pas dans
 * une consigne de revue.
 *
 * La navigation n'est pas adaptative : elle ne se réorganise pas selon un
 * profil inféré. La stabilité positionnelle prime sur l'optimisation.
 */
const DESTINATIONS = [
  { href: '/aujourdhui', libelle: 'Aujourd’hui' },
  { href: '/sujets', libelle: 'Sujets' },
  { href: '/bibliotheque', libelle: 'Bibliothèque' },
  { href: '/sources', libelle: 'Sources' },
] as const;

export default function LayoutApplication({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <nav
        aria-label="Destinations"
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-filet bg-surface p-3 md:w-52 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4"
      >
        <div className="mb-4 hidden items-center gap-2 px-2 md:flex">
          <span
            aria-hidden
            className="block size-[18px] rounded-[5px]"
            style={{
              background:
                'linear-gradient(140deg, var(--color-pano-froid-2), var(--color-pano-chaud-2))',
            }}
          />
          <b className="text-[14.5px] font-semibold tracking-[-0.015em]">Prisme</b>
        </div>
        {DESTINATIONS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="whitespace-nowrap rounded-s px-3 py-2 text-[13.5px] text-encre-2 transition-colors hover:bg-enfonce hover:text-encre"
          >
            {d.libelle}
          </Link>
        ))}
      </nav>
      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
