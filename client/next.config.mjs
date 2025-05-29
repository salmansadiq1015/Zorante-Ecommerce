/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["*"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // unoptimized: false,
  },
  reactStrictMode: true,
};

export default nextConfig;
