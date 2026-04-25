/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@forge/shared'],
  eslint: {
    // Lint is run explicitly via `npm run lint`. Skip during next build in CI
    // to keep the build step fast and deterministic.
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
