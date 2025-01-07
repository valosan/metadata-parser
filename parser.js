/**
 * Includes code from https://github.com/mozilla/page-metadata-parser
 * Copyright 2014-2022 Mozilla / Mozilla Public License 2.0
 **/
const { metadataRuleSets } = require("./ruleSets");

/**
 * @param {import("./types").MetadataRuleset} ruleSet
 * @returns {(doc: Document, context: import("./types").PageMetadataContext) => string | null}
 **/
function buildRuleSet(ruleSet) {
  return (doc, context) => {
    let maxScore = 0;
    let maxValue;

    for (let currRule = 0; currRule < ruleSet.rules.length; currRule++) {
      const [query, handler] = ruleSet.rules[currRule];

      /** @type {HTMLElement[]} */
      const elements = Array.from(doc.querySelectorAll(query));

      if (elements.length) {
        for (const element of elements) {
          let score = ruleSet.rules.length - currRule;

          if (ruleSet.scorers) {
            for (const scorer of ruleSet.scorers) {
              const newScore = scorer(element, score);

              if (newScore) {
                score = newScore;
              }
            }
          }

          if (score > maxScore) {
            maxScore = score;
            maxValue = handler(element);
          }
        }
      }
    }

    if (!maxValue && ruleSet.defaultValue) {
      maxValue = ruleSet.defaultValue(context);
    }

    if (maxValue) {
      if (ruleSet.processors) {
        for (const processor of ruleSet.processors) {
          maxValue = processor(maxValue, context);
        }
      }

      if (maxValue.trim) {
        maxValue = maxValue.trim();
      }

      return maxValue;
    }
  };
}

/**
 * @param {Document} doc
 * @param {string} url
 * @param {Record<keyof import("./types").PageMetadata, import("./types").MetadataRuleset>} customRuleSets
 * @returns {import("./types").PageMetadata}
 **/
export function getMetadata(doc, url, customRuleSets) {
  /** @type {import("./types").PageMetadata} */
  // @ts-ignore
  const metadata = {};
  const context = {
    url,
  };

  const ruleSets = customRuleSets || metadataRuleSets;

  /** @type {(keyof import("./types").PageMetadata)[]} */
  // @ts-ignore
  const keys = Object.keys(ruleSets);
  keys.map((ruleSetKey) => {
    const ruleSet = ruleSets[ruleSetKey];
    const builtRuleSet = buildRuleSet(ruleSet);
    // @ts-ignore
    metadata[ruleSetKey] = builtRuleSet(doc, context);
  });

  return metadata;
}
