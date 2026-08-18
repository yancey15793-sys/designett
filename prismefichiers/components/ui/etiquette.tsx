import { cn } from '@/lib/utils';
import type { StatutSujet } from '@/lib/domaine/types';

const LIBELLES: Record<StatutSujet, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  boucle: '✓ Bouclé',
  rouvert: 'Rouvert',
  ecarte: 'Écarté',
};

/**
 * Aucun statut de sujet n'est coloré (boucle 3 §4.6). La couleur de statut
 * est réservée à la santé technique d'une source, où elle décrit un fait
 * vérifiable — pas un jugement sur l'avancement de l'utilisateur.
 */
export function Etiquette({ statut }: { statut: StatutSujet }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs bg-enfonce px-2 py-1',
        'text-[11.5px] tracking-[0.008em] text-encre-2',
        statut === 'nouveau' && 'font-semibold text-encre',
      )}
    >
      {LIBELLES[statut]}
    </span>
  );
}
