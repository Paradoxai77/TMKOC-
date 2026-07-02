import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/TMKOC-",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
