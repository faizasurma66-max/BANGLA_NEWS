import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow logos hosted on Supabase Storage or linked from outlets' own domains.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
