import { segmentsPanorama } from '@/lib/domaine/panorama';
import type { Couverture, CranOrientation } from '@/lib/domaine/types';
import { cn } from '@/lib/utils';

/**
 * Répartition éditoriale — famille analytique.
 *
 * Ni rouge ni bleu : ce codage est INVERSÉ entre la France et les
 * États-Unis, et l'employer reviendrait à importer une lecture nationale.
 * La divergente violet ↔ ocre est validée par exécution du validateur
 * (séparation ΔE 26,8 en vision normale, 25,3 sous daltonisme) et son
 * mapping est déclaré conventionnel.
 */
const TEINTE: Record<CranOrientation, string> = {
  [-3]: 'var(--color-pano-froid-3)',
  [-2]: 'var(--color-pano-froid-2)',
  [-1]: 'var(--color-pano-froid-1)',
  0: 'var(--color-pano-centre)',
  1: 'var(--color-pano-chaud-1)',
  2: 'var(--color-pano-chaud-2)',
  3: 'var(--color-pano-chaud-3)',
};

const SOMBRE_SUR: CranOrientation[] = [-1, 0, 1];

export function BarrePanorama({
  couverture,
  compact = false,
  className,
}: {
  couverture: Couverture;
  compact?: boolean;
  className?: string;
}) {
  const segments = segmentsPanorama(couverture);
  if (segments.length === 0) return null;

  return (
    <div className={className}>
      <div
        className={cn('flex gap-0.5 overflow-hidden rounded', compact ? 'h-[7px]' : 'h-6')}
        role="img"
        aria-label={`Répartition éditoriale sur ${couverture.nbEditeurs} éditeurs`}
      >
        {segments.map((s) => (
          <span
            key={s.cran}
            className="grid place-items-center overflow-hidden font-donnees text-[10px] font-semibold"
            style={{
              flex: s.part,
              background: TEINTE[s.cran],
              color: SOMBRE_SUR.includes(s.cran) ? '#1A1A18' : '#fff',
            }}
          >
            {/* L'étiquetage direct n'est pas décoratif : trois crans de la
                palette passent sous 3:1 en mode clair, ce qui OBLIGE un
                canal de secours. */}
            {!compact && s.etiqueteDirectement ? `${Math.round(s.part * 100)}%` : null}
          </span>
        ))}
      </div>
    </div>
  );
}
