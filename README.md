# Metadata parser

Rebuild archived https://www.npmjs.com/package/page-metadata-parser so it can work in browser, NodeJS
and Puppeteer.

Provides additional `ld+json` parsing for better results.

Includes types for modern JS.

## Usage

```ts
import { getPageMetadata } from "@valosan/metadata-parser";

const metadata = getPageMetadata(document, url);
```

### Usage in ChromeDriver

```js
const metadataParser = fs.readFileSync(__dirname + "/../node_modules/@valosan/metadata-parser/dist/metadata.js", {
  encoding: "utf-8",
});

const metadata = await page.evaluate(`
    (function(){
      /* Extraction code */
      ${metadataParser}
      /* Return result */
      return getPageMetadata(document, String(window.location));
    }())
  `);
```

## Building

```
npm run build
npm publish --access public
```
