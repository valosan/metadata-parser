/**
 * Includes code from https://github.com/mozilla/page-metadata-parser
 * Copyright 2014-2022 Mozilla / Mozilla Public License 2.0
 **/

/**
 * @param {string} base
 * @param {string} relative
 * @returns {string}
 **/
function makeUrlAbsolute(base, relative) {
  return new URL(relative, base).href;
}

/**
 * @param {string} url
 * @returns {string}
 **/
function parseUrl(url) {
  return new URL(url).host;
}

/**
 * @param {string} host
 * @returns {string}
 **/
function getProvider(host) {
  return host
    .replace(/www[a-zA-Z0-9]*\./, "")
    .replace(".co.", ".")
    .split(".")
    .slice(0, -1)
    .join(" ");
}

/**
 * @type {Record<keyof import("./types").PageMetadata, import("./types").MetadataRuleset>}
 **/
export const metadataRuleSets = {
  description: {
    rules: [
      ['meta[property="og:description"]', (element) => element.getAttribute("content")],
      ['meta[name="description" i]', (element) => element.getAttribute("content")],
    ],
  },

  icon: {
    rules: [
      ['link[rel="apple-touch-icon"]', (element) => element.getAttribute("href")],
      ['link[rel="apple-touch-icon-precomposed"]', (element) => element.getAttribute("href")],
      ['link[rel="icon" i]', (element) => element.getAttribute("href")],
      ['link[rel="fluid-icon"]', (element) => element.getAttribute("href")],
      ['link[rel="shortcut icon"]', (element) => element.getAttribute("href")],
      ['link[rel="Shortcut Icon"]', (element) => element.getAttribute("href")],
      ['link[rel="mask-icon"]', (element) => element.getAttribute("href")],
    ],
    scorers: [
      // Handles the case where multiple icons are listed with specific sizes ie
      // <link rel="icon" href="small.png" sizes="16x16">
      // <link rel="icon" href="large.png" sizes="32x32">
      (element, score) => {
        const sizes = element.getAttribute("sizes");

        if (sizes) {
          const sizeMatches = sizes.match(/\d+/g);
          if (sizeMatches) {
            return sizeMatches[0];
          }
        }
      },
    ],
    defaultValue: (context) => "favicon.ico",
    processors: [(icon_url, context) => makeUrlAbsolute(context.url, icon_url)],
  },

  image: {
    rules: [
      ['meta[property="og:image:secure_url"]', (element) => element.getAttribute("content")],
      ['meta[property="og:image:url"]', (element) => element.getAttribute("content")],
      ['meta[property="og:image"]', (element) => element.getAttribute("content")],
      ['meta[name="twitter:image"]', (element) => element.getAttribute("content")],
      ['meta[property="twitter:image"]', (element) => element.getAttribute("content")],
      ['meta[name="thumbnail"]', (element) => element.getAttribute("content")],
    ],
    processors: [(image_url, context) => makeUrlAbsolute(context.url, image_url)],
  },

  keywords: {
    rules: [['meta[name="keywords" i]', (element) => element.getAttribute("content")]],
    processors: [(keywords, context) => keywords.split(",").map((/** @type {string} */ keyword) => keyword.trim())],
  },

  title: {
    rules: [
      ['meta[property="og:title"]', (element) => element.getAttribute("content")],
      ['meta[name="twitter:title"]', (element) => element.getAttribute("content")],
      ['meta[property="twitter:title"]', (element) => element.getAttribute("content")],
      ['meta[name="hdl"]', (element) => element.getAttribute("content")],
      ["title", (element) => element.textContent],
    ],
  },

  language: {
    rules: [
      ["html[lang]", (element) => element.getAttribute("lang")],
      ['meta[name="language" i]', (element) => element.getAttribute("content")],
    ],
    processors: [(language, context) => language.split("-")[0]],
  },

  type: {
    rules: [['meta[property="og:type"]', (element) => element.getAttribute("content")]],
  },

  url: {
    rules: [
      ["a.amp-canurl", (element) => element.getAttribute("href")],
      ['link[rel="canonical"]', (element) => element.getAttribute("href")],
      ['meta[property="og:url"]', (element) => element.getAttribute("content")],
    ],
    defaultValue: (context) => context.url,
    processors: [(url, context) => makeUrlAbsolute(context.url, url)],
  },

  provider: {
    rules: [['meta[property="og:site_name"]', (element) => element.getAttribute("content")]],
    defaultValue: (context) => getProvider(parseUrl(context.url)),
  },

  published: {
    rules: [
      ['meta[name="date-pub"]', (element) => element.getAttribute("content")],
      ['meta[property="article:published_time"]', (element) => element.getAttribute("content")],
      ['meta[name="datePublished"]', (element) => element.getAttribute("content")],
      ['meta[name="iso-8601-publish-date"]', (element) => element.getAttribute("content")],
      ['meta[name="cXenseParse:recs:publishtime"]', (element) => element.getAttribute("content")],
      ['meta[name="sailthru.date"]', (element) => element.getAttribute("content")],
    ],
  },

  locale: {
    rules: [['meta[property="og:locale"]', (element) => element.getAttribute("content")]],
  },
};
