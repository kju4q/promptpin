/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide polyfills for Node.js built-in modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve("buffer/"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util/"),
        fs: false,
        net: false,
        tls: false,
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        path: require.resolve("path-browserify"),
        process: require.resolve("process/browser"),
        url: require.resolve("url/"),
      };

      // Add plugins for polyfills
      config.plugins.push(
        new (require("webpack").ProvidePlugin)({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
