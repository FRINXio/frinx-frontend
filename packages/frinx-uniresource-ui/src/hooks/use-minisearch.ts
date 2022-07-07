import { useEffect, useRef, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import { throttle } from 'lodash';

type Item<T> = T & { Name: string };

export function getFilteredResults<T extends { Name: string }>(searchResult: SearchResult[], items: T[]): T[] {
  const resultIds = searchResult.map((r) => r.id);
  return items.filter((item) => resultIds.includes(item.Name));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useMinisearch = (items?: Item<any>[]) => {
  const [searchText, setSearchText] = useState('');
  const { current: minisearch } = useRef(new MiniSearch({ fields: ['Name'], idField: 'Name' }));
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
    handleSearchTextChange: setSearchText,
  };
};

export default useMinisearch;
