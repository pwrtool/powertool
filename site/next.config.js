/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    mdxRs: true,
  },

  async headers() {
    return [
      /*       {
        source: "/api/kit/*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      }, */
    ];
  },
};

module.exports = nextConfig;
