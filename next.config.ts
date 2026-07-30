import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Todo o site, exceto /studio — o Studio precisa poder ser exibido
        // dentro de um iframe em sanity.io (o "Dashboard" deles), o que
        // X-Frame-Options: SAMEORIGIN bloquearia.
        source: '/((?!studio).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // CSP no lugar de X-Frame-Options: permite ser embutido só pelo
        // próprio domínio e pelo Dashboard do Sanity, não por qualquer site.
        source: '/studio/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://sanity.io https://*.sanity.io",
          },
        ],
      },
    ];
  },
  async redirects() {
    return []; // registrar aqui todo slug que mudar depois de publicado
  },
};

export default config;
