import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "readdy.ai",
        port: "", // port belirtilmemişse boş bırakılır
        pathname: "/api/search-image/**", // readdy.ai altındaki bu path'ten gelen görsellere izin ver
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Cloudinary'deki tüm resimlere izin ver
      },
    ],
  },
  /* diğer config seçenekleri buraya gelebilir */
};

export default withPWA(nextConfig);
