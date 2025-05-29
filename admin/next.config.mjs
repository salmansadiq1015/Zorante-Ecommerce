/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "socialface.s3.eu-north-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ayoob.ecom.s3.eu-north-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
    domains: ["cdn.shopify.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
