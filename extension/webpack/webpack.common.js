const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";

module.exports = {
  entry: {
    popup: path.join(__dirname, srcDir + "popup.ts"),
    options: path.join(__dirname, srcDir + "options.ts"),
    background: path.join(__dirname, srcDir + "background.ts"),
    content_script: path.join(__dirname, srcDir + "content_script.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial",
    },
  },
  module: {
    rules: [
      {
        test: /\.go/,
        // use: ["golang-wasm-async-loader"],
        loader: require.resolve("golang-wasm-async-loader")
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: require.resolve("@open-wc/webpack-import-meta-loader"),
      },
    ],
  },
  resolve: {
    extensions: [".go", ".ts", ".tsx", ".js"],
  },
  node: {
    fs: "empty",
  },
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
  ],
  // experiments: {
  //   syncWebAssembly: true,
  // }
};
