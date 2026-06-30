/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint is run in CI/locally; don't let a style-only rule block a deploy.
  // TypeScript errors still fail the build (type safety is preserved).
  eslint: { ignoreDuringBuilds: true },
  // Allow streaming responses from route handlers without buffering.
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
