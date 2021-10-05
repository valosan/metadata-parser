/* eslint-disable no-console */

/**
 * Keep in JS for compatibility with puppeteer.
 *
 * This file is used in screenshot function and injected verbatim
 * into the Chrome browser context.
 */
function parsePageMetadata(getMetadata, metadataRuleSets, document, url) {
  const metadata = getMetadata(document, url, {
    ...metadataRuleSets,
    published: {
      rules: [
        [
          'meta[property="article:published_time"]',
          element => element.getAttribute("content")
        ],
        ['meta[name="datePublished"]', element => element.getAttribute("content")],
        ['meta[name="iso-8601-publish-date"]', element => element.getAttribute("content")]
      ]
    },
    locale: {
      rules: [
        [
          'meta[property="og:locale"]',
          element => element.getAttribute("content")
        ]
      ]
    }
  });

  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld && ld.textContent) {
    try {
      const info = JSON.parse(ld.textContent);
      if (info["@graph"]) {
        info["@graph"].forEach(l => {
          if (l.datePublished) {
            metadata.published = l.datePublished;
          }
        });
      }
      if (info.datePublished) {
        metadata.published = info.datePublished;
      }
    } catch (e) {
      console.warn("Failed to parse ld+json for", url, e);
    }
  }

  return metadata;
}

try {
  module.exports = {
    parsePageMetadata
  };
} catch (e) {}
