/** @type {import('next').NextConfig} */
const nextConfig = {
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
