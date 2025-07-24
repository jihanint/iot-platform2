/** @type {import('next').NextConfig} */
const BASE_URL_LANDING_iothub = process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub;

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MOCK_ENABLED: process.env.MOCK_ENABLED,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: "false",
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/",
  //       destination: `${BASE_URL_LANDING_iothub}`,
  //     },
  //     {
  //       source: "/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}:path*`,
  //     },
  //     {
  //       source: "/_next/static/chunks/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}/_next/static/chunks/:path*`,
  //     },

  //     {
  //       source: "/_next/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}_next/:path*`,
  //     },
  //     {
  //       source: "/images/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}images/:path*`,
  //     },
  //     {
  //       source: "/assets/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}assets/:path*`,
  //     },
  //     {
  //       source: "/videos/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}videos/:path*`,
  //     },
  //     {
  //       source: "/fonts/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}fonts/:path*`,
  //     },
  //     {
  //       source: "/landing",
  //       destination: `${BASE_URL_LANDING_iothub}`,
  //     },
  //     {
  //       source: "/landing/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}/:path*`,
  //     },
  //     {
  //       source: "/landing/_next/:path*",
  //       destination: `${BASE_URL_LANDING_iothub}/_next/:path*`,
  //     },
  //   ];
  // },
  async redirects() {
    return [
      {
        source: "/home/auth/login",
        destination: "/auth/login",
        basePath: false,
        permanent: true,
      },
      {
        source: "/home/auth/register",
        destination: "/auth/register",
        basePath: false,
        permanent: true,
      },
      {
        source: "/home/dashboard",
        destination: "/dashboard",
        basePath: false,
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/_nuxt/:path*",
        destination: `${BASE_URL_LANDING_iothub}_nuxt/:path*`,
      },
      {
        source: "/images/:path*",
        destination: `${BASE_URL_LANDING_iothub}images/:path*`,
      },
      {
        source: "/videos/:path*",
        destination: `${BASE_URL_LANDING_iothub}videos/:path*`,
      },
      {
        source: "/fonts/:path*",
        destination: `${BASE_URL_LANDING_iothub}fonts/:path*`,
      },

      // LANDING PAGE
      {
        source: "/home",
        destination: `${BASE_URL_LANDING_iothub}${process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub_BASE_PATH}`,
      },
      {
        source: "/home/:path*",
        destination: `${BASE_URL_LANDING_iothub}${process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub_BASE_PATH}/:path*`,
      },
      {
        source: "/home/_next/:path*",
        destination: `${BASE_URL_LANDING_iothub}${process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub_BASE_PATH}/_next/:path*`,
      },

      {
        source: "/home/assets/:path*",
        destination: `${BASE_URL_LANDING_iothub}${process.env.NEXT_PUBLIC_BASE_URL_LANDING_iothub_BASE_PATH}/assets/:path*`,
      },

      // {
      //   source: '/_next/image/:path*',
      //   destination: 'https://staging-icownic.vercel.app/_next/image/:path*',
      // },
    ];
  },
};

module.exports = nextConfig;
