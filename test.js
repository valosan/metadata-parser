const { getMetadata, metadataRuleSets } = require("page-metadata-parser");
const { parsePageMetadata } = require("./metadata");
const domino = require("domino");
const fs = require("fs");
const { assert } = require("console");

const html = fs.readFileSync("./test1.html", { encoding: "utf8"})
const doc = domino.createWindow(html).document;
const metadata = parsePageMetadata(getMetadata, metadataRuleSets, 
    doc,
"https://techcrunch.com/2022/05/19/god-of-war-ragnarok-sets-a-strong-example-for-next-gen-gaming-accessibility-options/");
console.info("Metadata", metadata)
assert(metadata.title === "God of War Ragnarok’s accessibility settings on Playstation – TechCrunch")