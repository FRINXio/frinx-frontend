import { useEffect, useRef, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import { compact, throttle } from 'lodash';

type Item<T> = T & { Name: string };

function getFilteredResults<T extends { Name: string }>(searchResult: SearchResult[], items: T[]): T[] {
  const itemsMap = new Map(items.map((item) => [item.Name, item]));
  return compact(
    searchResult.map((r) => {
      return itemsMap.get(r.id);
    }),
  );
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

  useEffect(() => minisearch.addAll(items || []), []);

  const results = searchText && searchText.length > 2 ? searchFn() : items;

  return {
    results: results || [],
    searchText,
    setSearchText,
  };
};

export default useMinisearch;
