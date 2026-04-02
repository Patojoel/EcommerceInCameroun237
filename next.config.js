/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Images distantes autorisées ---
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth avatars
      },
    ],
  },

  // --- Headers de sécurité HTTP ---
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // --- Redirections ---
  async redirects() {
    return [
      // Exemple : rediriger l'ancien chemin /shop vers /products
      // {
      //   source: '/shop',
      //   destination: '/products',
      //   permanent: true,
      // },
    ];
  },

  // --- Variables d'environnement exposées côté client ---
  // (préférer NEXT_PUBLIC_ prefix pour les vars publiques)
  env: {
    // NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // --- Optimisations ---
  compress: true,
  poweredByHeader: false, // Supprimer le header X-Powered-By

  // --- TypeScript strict en build ---
  typescript: {
    ignoreBuildErrors: false, // Ne JAMAIS passer à true en prod
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
