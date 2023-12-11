/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import webpack from "webpack";
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },

  webpack: (config, { isServer }) => {
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^node:buffer$/ }));
    // This is for react-pdf.
    config.resolve.alias.canvas = false;

    return config;
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
