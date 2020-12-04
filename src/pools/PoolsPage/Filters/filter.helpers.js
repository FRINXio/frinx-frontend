// @flow
import differenceBy from 'lodash/differenceBy';
import type { Pool } from '../../pool.types';

export function sanitizeString(value: string): string {
  return value.trim().toLocaleLowerCase();
}

// TODO: write unit test

export function filterByQuery(query: ?string): (Pool[]) => Pool[] {
  return (array) => {
    if (query == null || query === '') {
      return array;
    }
    const sanitizedQuery = sanitizeString(query);

    return array.filter((value) => {
      const { Name, PoolType } = value;
      const sanitizedName = sanitizeString(Name);
      const sanitizedPoolType = sanitizeString(PoolType);
      return sanitizedName.includes(sanitizedQuery) || sanitizedPoolType.includes(sanitizedQuery);
    });
  };
}

export function filterByTags(tags: { id: string }[]): (Pool[]) => Pool[] {
  return (array) => {
    if (tags.length === 0) {
      return array;
    }

    return array.filter((value) => {
      return differenceBy(tags, value.Tags, (t) => t.id) === 0;
    });
  };
}

export function filterByPoolType(query: ?string): (Pool[]) => Pool[] {
  return (array) => {
    if (query == null || query === '') {
      return array;
    }
    return array.filter((value) => value.PoolType === query);
  };
}

export function filterByStrategy(query: ?string): (Pool[]) => Pool[] {
  return (array) => {
    if (query == null || query === '') {
      return array;
    }
    return array.filter((value) => value.AllocationStrategy?.id === query);
  };
}

export function filterByResourceType(query: ?string): (Pool[]) => Pool[] {
  return (array) => {
    if (query == null || query === '') {
      return array;
    }
    return array.filter((value) => value.ResourceType?.id === query);
  };
}
