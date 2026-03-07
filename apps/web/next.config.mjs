/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  eslint: {
    // Disable ESLint during builds (e.g. on Vercel)
    ignoreDuringBuilds: true
  }
};

export default nextConfig;


