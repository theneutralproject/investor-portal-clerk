/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: ['docusign-esign', 'pdf-parse'],
  },
  webpack: (config) => {
    // config.resolve.fallback = {
    //   // TODO NOT CONFIDENT THIS IS A GOOD IDEA YET - THIS WAS AN ATTEMPT TO GET PLAYWRIGHT TO WORK AFTER CLERK UPGRADE
    //   ...config.resolve.fallback,  
    //   async_hooks: false,
    //   fs: false,
    //   child_process: false,
    // };
    config.externals.push({
      'node:crypto': 'commonjs crypto',
    });
    return config;
  },
};

export default config;
