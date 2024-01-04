/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
