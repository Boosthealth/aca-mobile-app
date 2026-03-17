const { withNativeWind } = require("nativewind/metro");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// Add SVG to asset extensions
config.resolver.assetExts.push("svg");

module.exports = withNativeWind(config, {
  input: "./global.css",
  configPath: "./tailwind.config.js",
  inlineStyles: true,
  native: true,
});