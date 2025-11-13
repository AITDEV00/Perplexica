import { getSearxngURL } from './config/serverRegistry';
import { getMaskedQuery, MaskQueryResponse } from './mask';

interface SearxngSearchOptions {
  categories?: string[];
  engines?: string[];
  language?: string;
  pageno?: number;
}

interface SearxngSearchResult {
  title: string;
  url: string;
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  content?: string;
  author?: string;
  iframe_src?: string;
}

export const searchSearxng = async (
  query: string,
  opts?: SearxngSearchOptions,
) => {
  const searxngURL = getSearxngURL();

  // Fetch masked query
  const maskedResponse: MaskQueryResponse = await getMaskedQuery(query);
  const finalQuery = maskedResponse?.masked_query || query;

  // Log visibility for masked/unmasked comparison
  console.log('\n==============================');
  console.log('🔍  Searxng Query Details');
  console.log('------------------------------');
  console.log('🟠 Original Query:', query);
  console.log('🟢 Masked Query  :', finalQuery);
  console.log('==============================\n');

  // Construct URL
  const url = new URL(`${searxngURL}/search?format=json`);
  url.searchParams.append('q', finalQuery);

  // Add optional parameters
  if (opts) {
    Object.keys(opts).forEach((key) => {
      const value = opts[key as keyof SearxngSearchOptions];
      if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(','));
      } else if (value) {
        url.searchParams.append(key, value as string);
      }
    });
  }

  // Perform search
  const res = await fetch(url);
  const data = await res.json();

  const results: SearxngSearchResult[] = data.results;
  const suggestions: string[] = data.suggestions;

  return { results, suggestions };
};
