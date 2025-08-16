// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Füge diesen Block hinzu
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/logos/**",
      },
    ],
  },
};

module.exports = nextConfig;
