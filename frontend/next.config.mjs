import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
 
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'flagcdn.com',
          },
          {
            protocol: 'https',
            hostname: 'email-builder-zeta.vercel.app',
          },
        ],
      },
};
 
export default withNextIntl(nextConfig);