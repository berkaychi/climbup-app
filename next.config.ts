import type { NextConfig } from "next";

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

export default nextConfig;
