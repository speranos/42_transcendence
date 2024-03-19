
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
      // all these domains are temporary, for testing purposes.
    },
    typescript: {
      ignoreBuildErrors: true,
    },
};
module.exports = nextConfig;
  