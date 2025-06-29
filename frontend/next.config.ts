import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:3000/uploads/:path*", // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
