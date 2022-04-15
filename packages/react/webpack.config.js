const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const mode = "development";

const externals = {
  react: "react",
};

const legacyConfig = {
  entry: "./src/index.tsx",
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib", "legacy"),
    globalObject: "this",
    library: {
      name: "@rollout/react",
      type: "umd",
    },
  },
  externals,
};

const modernConfig = {
  entry: "./src/index.tsx",
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.modern.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib", "modern"),
    globalObject: "this",
    library: {
      name: "@rollout/react",
      type: "umd",
    },
  },
  externals,
  plugins:
    process.env.NODE_ENV === "development"
      ? [new BundleAnalyzerPlugin()]
      : undefined,
};

const ssrConfig = {
  entry: "./src/ssr.ts",
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "ssr.js",
    path: path.resolve(__dirname, "lib"),
    globalObject: "this",
    library: {
      name: "@rollout/react",
      type: "umd",
    },
  },
  externals,
};

module.exports = [legacyConfig, modernConfig, ssrConfig];
