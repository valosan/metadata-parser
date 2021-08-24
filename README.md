# Metadata parser

Bundles https://www.npmjs.com/package/page-metadata-parser so it can work when injected into Chrome browser context (i.e. puppeteer)

## Usage

```js
const metadataScript = fs.readFileSync(
  __dirname + "/../node_modules/@valosan/metadata-parser/page-metadata-parser.bundle.js",
  {
    encoding: "utf-8"
  }
);

const metadataParser = fs.readFileSync(
  __dirname + "/../node_modules/@valosan/metadata-parser/metadata.js",
  {
    encoding: "utf-8"
  }
);

const metadata = await page.evaluate(`
    (function(){
      /* Metadata script */
      ${metadataScript}
      /* Extraction code */
      ${metadataParser}
      /* Return result */
      return parsePageMetadata(metadataparser.getMetadata, metadataparser.metadataRuleSets, document, String(window.location));
    }())
  `)
```

## Building

```
npm run build
npm publish --access public
```
