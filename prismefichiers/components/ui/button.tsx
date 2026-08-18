import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Vendu à la manière shadcn/ui — le composant vit dans le dépôt, pas dans
 * node_modules. Variantes alignées sur la boucle 3 §4.2.
 *
 * Règle S2 : l'action primaire est de l'ENCRE, jamais une teinte. Il n'existe
 * volontairement pas de variante colorée, et l'API n'expose aucun `badge`.
 */
const variantes = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-s font-medium ' +
    'transition-colors duration-[140ms] ease-standard disabled:pointer-events-none ' +
    'disabled:text-n-300 border border-transparent cursor-pointer',
  {
    variants: {
      variante: {
        primaire: 'bg-encre text-encre-inv hover:opacity-90',
        secondaire: 'border-bord text-encre hover:bg-survol',
        discret: 'text-encre-2 hover:bg-survol',
        destructif: 'border-st-critique text-st-critique hover:bg-survol',
      },
      taille: {
        s: 'h-7 px-3 text-[13px]',
        m: 'h-9 px-4 text-sm',
        l: 'h-12 px-5 text-base font-semibold',
      },
    },
    defaultVariants: { variante: 'secondaire', taille: 'm' },
  },
);

export interface ProprietesBouton
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantes> {
  asChild?: boolean;
}

export function Button({
  className,
  variante,
  taille,
  asChild = false,
  ...reste
}: ProprietesBouton) {
  const Composant = asChild ? Slot : 'button';
  return (
    <Composant className={cn(variantes({ variante, taille }), className)} {...reste} />
  );
}
