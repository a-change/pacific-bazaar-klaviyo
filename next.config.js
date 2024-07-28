const { i18n } = require("./next-i18next.config");
const runtimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: '/service-worker.js',
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
});

if (process.env.NODE_ENV === 'development') {
  module.exports = {
    i18n,
    devIndicators: {},
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.bloomreach.io',
          port: '',
          pathname: '/delivery/resources/**'
        }
      ]
    },
    publicRuntimeConfig: {
      // Available on both server and client
      theme: "DEFAULT",
      currency: "USD",
    },
    modularizeImports: {
      '@mui/icons-material': {
        transform: '@mui/icons-material/{{member}}',
      },
    }
  };
} else {
  module.exports = withPWA({
    i18n,
    devIndicators: {},
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.bloomreach.io',
          port: '',
          pathname: '/delivery/resources/content/gallery/**'
        }
      ]
    },
    publicRuntimeConfig: {
      // Available on both server and client
      theme: "DEFAULT",
      currency: "USD",
    },
    modularizeImports: {
      '@mui/icons-material': {
        transform: '@mui/icons-material/{{member}}',
      },
    }
  });
}

/*
module.exports = {
  i18n,
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
    currency: "USD",
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  }
};
 */
