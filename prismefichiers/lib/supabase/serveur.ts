import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Client Supabase côté serveur.
 *
 * Toujours la clé anonyme, jamais la clé de service : les politiques RLS de
 * la migration 0004 sont la frontière de sécurité, et une clé de service
 * dans le chemin de rendu la contournerait silencieusement. L'ingestion —
 * seul chemin d'écriture vers le corpus mutualisé — vit hors de cette
 * application.
 */
export async function clientServeur() {
  const magasin = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return magasin.getAll();
        },
        setAll(aPoser) {
          try {
            for (const { name, value, options } of aPoser) {
              magasin.set(name, value, options);
            }
          } catch {
            // Appelé depuis un Server Component : le middleware rafraîchit
            // la session, on peut ignorer sans risque.
          }
        },
      },
      db: { schema: 'prisme' },
    },
  );
}
