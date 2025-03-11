// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   // Enable webpack file watching polling for Docker
//   webpack: (config, { isServer }) => {
//     // TypeScript needs type assertion here since config could be undefined
//     if (!isServer && config.watchOptions !== undefined) {
//       config.watchOptions = {
//         poll: 1000,
//         aggregateTimeout: 300,
//       }
//     }
//     return config
//   },
// }

// export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   // For webpack, explicitly enable polling for Docker
//   webpack: (config) => {
//     // Configure file watching
//     config.watchOptions = {
//       poll: 1000,
//       aggregateTimeout: 300,
//       ignored: /node_modules/
//     };
//     return config;
//   },
//   // Disable the experimental turbopack telemetry and increase poll interval
//   experimental: {
//     // If using Turbopack, you can add settings here
//   },
//   // Allow access from any hostname in dev mode
//   webpackDevMiddleware: config => {
//     config.watchOptions = {
//       poll: 1000,
//       aggregateTimeout: 300,
//     }
//     return config
//   },
// }

// module.exports = nextConfig


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
  
//   // Configure webpack for Docker environment
//   webpack: (config) => {
//     // Enable polling for file changes
//     config.watchOptions = {
//       poll: 1000,
//       aggregateTimeout: 300,
//       ignored: /node_modules/
//     };
//     return config;
//   },
  
//   // Optimize page buffer to improve hot reloading
//   onDemandEntries: {
//     // Keep pages in memory longer
//     maxInactiveAge: 60 * 1000,
//     // Increase number of pages kept in memory
//     pagesBufferLength: 5,
//   },
  
//   // WebpackDevMiddleware options
//   webpackDevMiddleware: config => {
//     config.watchOptions = {
//       poll: 1000,
//       aggregateTimeout: 300,
//     }
//     return config
//   },
  
//   // Disable static optimization to improve hot reloading
//   staticPageGenerationTimeout: 120,
  
//   // Ensures changes are reflected
//   experimental: {
//     optimizeCss: true,
//     esmExternals: 'loose'
//   }
// }

// module.exports = nextConfig



import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Configure webpack for Docker environment
  webpack: (config) => {
    // Enable polling for file changes
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/
    };
    return config;
  },
  
  // Optimize page buffer to improve hot reloading
  onDemandEntries: {
    // Keep pages in memory longer
    maxInactiveAge: 60 * 1000,
    // Increase number of pages kept in memory
    pagesBufferLength: 5,
  },
  
  // WebpackDevMiddleware options
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  
  // Disable static optimization to improve hot reloading
  staticPageGenerationTimeout: 120,
  
  // Ensures changes are reflected
  experimental: {
    optimizeCss: true,
    esmExternals: 'loose'
  }
};

export default nextConfig;
