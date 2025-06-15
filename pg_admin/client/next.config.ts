// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['localhost'],
//   },
// };

// module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '7000',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.pg-admin.57.155.183.218.nip.io',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'api.pg-admin.57.155.183.218.nip.io',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;