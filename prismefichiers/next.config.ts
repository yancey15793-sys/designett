import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    // Le domaine est pur : on veut qu'une régression d'import (React ou
    // Supabase remontant dans lib/domaine) casse au plus tôt.
    typedEnv: false,
  },
};

export default config;
