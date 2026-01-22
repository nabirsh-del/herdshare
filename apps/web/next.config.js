/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['@herdshare/db'],
};

module.exports = nextConfig;
