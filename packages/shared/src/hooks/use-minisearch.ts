import { useEffect, useRef, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import { compact, throttle } from 'lodash';

function getFilteredResults<T extends { Name: string }>(searchResult: SearchResult[], items: T[]): T[] {
  const itemsMap = new Map(items?.map((item) => [item.Name, item]));

  return compact(
    searchResult.map((r) => {
      return itemsMap.get(r.id);
    }),
  );
}

type UseMiniSearchProps<T extends { Name: string }> = {
  items?: T[];
  searchFields?: string[];
  extractField?: (document: T, fieldName: string) => string;
};

const useMinisearch = <T extends { Name: string }>({
  items = [],
  searchFields = ['Name'],
  extractField,
}: UseMiniSearchProps<T>) => {
  const [searchText, setSearchText] = useState('');
  const { current: minisearch } = useRef(
    new MiniSearch({ fields: searchFields, idField: 'Name', ...(extractField != null && { extractField }) }),
  );

  const searchFn = () =>
    throttle(() => {
      if (searchText) {
        return getFilteredResults(minisearch.search(searchText, { prefix: true }), items);
      }
      return [];
    }, 80)();

  useEffect(() => {
    minisearch.removeAll();
    minisearch.addAll(items);
  }, [items, minisearch]);

  const results = searchText.length > 0 ? searchFn() ?? [] : items;
  return {
    results,
    searchText,
    setSearchText,
  };
};

export default useMinisearch;
