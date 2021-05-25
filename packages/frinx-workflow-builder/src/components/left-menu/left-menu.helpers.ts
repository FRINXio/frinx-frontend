import { SearchResult } from 'minisearch';

export function getFilteredResults<T extends { name: string }>(searchResult: SearchResult[], defs: T[]): T[] {
  const resultIds = searchResult.map((r) => r.id);
  return defs.filter((df) => resultIds.includes(df.name));
}

export function parseDescription(value?: string): string | null {
  if (value == null) {
    return null;
  }
  try {
    const { description } = JSON.parse(value);
    return description;
  } catch (e) {
    return value;
  }
}
export function parseLabels(value?: string): string[] | null {
  if (value == null) {
    return null;
  }
  try {
    const { labels } = JSON.parse(value);
    return labels;
  } catch (e) {
    return null;
  }
}
