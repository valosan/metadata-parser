export interface PageMetadata {
  description?: string;
  icon: string;
  image?: string;
  keywords?: string[];
  title?: string;
  language?: string;
  type?: string;
  url: string;
  provider: string;
  published?: string;
  locale?: string;
}

export interface PageMetadataContext {
  url: string;
}

export type PageMetadataRule = [string, (el: HTMLElement) => string | null];

export interface MetadataRuleset<O = any, CMP = any> {
  rules: PageMetadataRule[];
  scorers?: ((el: HTMLElement, score: CMP) => CMP)[];
  defaultValue?: (context: PageMetadataContext) => O;
  processors?: ((output: O, context: PageMetadataContext) => any)[];
}
