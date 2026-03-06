/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  basePath: "/tika",
  assetPrefix: "/tika",
  output: "standalone",
};

module.exports = nextConfig;
