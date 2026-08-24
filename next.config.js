/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.openstreetmap.org" },
      { protocol: "https", hostname: "openweathermap.org" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"]
  }
};

module.exports = nextConfig;
