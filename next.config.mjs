/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This is a workaround for a warning in the console:
    // "require.extensions is not supported by webpack. Use a loader instead."
    // It's caused by the handlebars library, which is a dependency of genkit.
    config.externals.push({
      'handlebars': 'commonjs handlebars',
    });

    return config;
  },
};

export default nextConfig;
