import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // fotos de lanches enviadas pelo painel admin. A Vercel recusa corpos
      // acima de 4,5 MB, então o limite de src/lib/upload.ts fica em 4 MB.
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
