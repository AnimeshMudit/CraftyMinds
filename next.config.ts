import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "buswdznodxyugbipflnc.supabase.co",
      },
    ],
  },
};

export default nextConfig;