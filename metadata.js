/* eslint-disable no-console */
const { getMetadata } = require("./parser");
const { metadataRuleSets } = require("./ruleSets");

/**
 * Parse page metadata and also LD+JSON if present.
 *
 * @param {Document} document
 * @param {string} url
 * @returns {import("./types").PageMetadata}
 */
export function getPageMetadata(document, url) {
  const metadata = getMetadata(document, url, metadataRuleSets);

  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld && ld.textContent) {
    try {
      const info = JSON.parse(ld.textContent);

      if (info["@graph"]) {
        // @ts-ignore
        info["@graph"].forEach((l) => {
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
