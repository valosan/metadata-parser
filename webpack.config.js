const path = require("path");

/**
 * Creates single file with parser for injection into
 * Chrome browser context.
 *
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: "production",
  entry: "./metadata.js",
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: [
          {
            and: [
              path.resolve(__dirname, "node_modules"),
              path.resolve(__dirname, "test.js"),
              path.resolve(__dirname, "webpack.config.js"),
            ],
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
    innerGraph: true,
    mangleExports: false,
    sideEffects: true,
    usedExports: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: __dirname + "/dist",
    filename: "metadata.js",
    libraryTarget: "umd",
    globalObject: "this",
  },
};
