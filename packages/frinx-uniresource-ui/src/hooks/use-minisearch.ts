import { useEffect, useRef, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import { throttle } from 'lodash';

type Item<T> = T & { Name: string };

export function getFilteredResults<T extends { Name: string }>(searchResult: SearchResult[], items: T[]): T[] {
  const resultIds = searchResult.map((r) => r.id);
  return items.filter((item) => resultIds.includes(item.Name));
}

const useMinisearch = <T>({
  items,
  searchFields = ['Name'],
  extractField,
}: {
  items?: Item<T>[];
  searchFields?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractField?: (document: any, fieldName: string) => string;
}) => {
  const [searchText, setSearchText] = useState('');
  const { current: minisearch } = useRef(
    new MiniSearch({ fields: searchFields, idField: 'Name', ...(extractField != null && { extractField }) }),
  );
  const searchFn = () =>
    throttle(() => {
      if (searchText != null) {
        return getFilteredResults(minisearch.search(searchText, { prefix: true }), items || []);
      }

      return [];
    }, 80)();

  useEffect(() => minisearch.addAll(items || []));

  const results = searchText && searchText.length > 2 ? searchFn() : items;

  return {
    results: results || [],
    searchText,
    setSearchText,
  };
};

export default useMinisearch;
