/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@leadpulse/domain",
    "@leadpulse/contracts",
    "@leadpulse/infrastructure",
    "@leadpulse/ui",
  ],
  reactStrictMode: true,
  typescript: {
    // Monorepo typechecking is executed comprehensively via `npm run typecheck`
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
