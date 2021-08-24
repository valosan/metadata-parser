/**
 * Creates single file with parser for injection into
 * Chrome browser context.
 *
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: "production",
  entry: ["./node_modules/page-metadata-parser/parser.js"],
  externals: {
    url: "window"
  },
  output: {
    path: __dirname,
    filename: "page-metadata-parser.bundle.js",
    libraryTarget: "var",
    library: "metadataparser"
  }
};
