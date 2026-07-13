/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
  async redirects() {
    const sources = [
      'reddit', 'instagram', 'twitter', 'facebook',
      'whatsapp', 'tiktok', 'linkedin', 'youtube',
      'snapchat', 'telegram',
    ];
    return sources.map(s => ({
      source: `/${s}`,
      destination: `/?utm_source=${s}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
