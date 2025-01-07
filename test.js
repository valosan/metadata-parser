const { getPageMetadata } = require("./dist/metadata.js");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const { assert } = require("console");

const dir = fs.readdirSync("./test");

const sanitizeHtml = (html) => {
  return html
    ?.replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gim, "")
    ?.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/gim, "");
};

dir
  .filter((file) => file.endsWith(".html"))
  .forEach((file) => {
    const html = fs.readFileSync(`./test/${file}`, { encoding: "utf8" });
    const doc = new JSDOM(sanitizeHtml(html)).window.document;
    const metadata = getPageMetadata(
      doc,
      `https://techcrunch.com/2022/05/19/god-of-war-ragnarok-sets-a-strong-example-for-next-gen-gaming-accessibility-options/`
    );
    console.info("Metadata", metadata);
  });
