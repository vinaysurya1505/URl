/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server actions
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Increase API payload size to 500mb
  api: {
    responseLimit: '500mb',
  },
};

module.exports = nextConfig;
