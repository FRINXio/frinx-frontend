// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';

export const filterByQuery = (searchQuery, array) =>
  !searchQuery
    ? array
    : array.filter((e) => {
        const searchedKeys = ['Name', 'PoolType'];

        for (let i = 0; i < searchedKeys.length; i += 1) {
          if (e[searchedKeys[i]].toString().toLowerCase().includes(searchQuery.toLocaleLowerCase())) {
            return true;
          }
        }
        return false;
      });

export const filterByTags = (tags, array) =>
  tags.length < 1
    ? array
    : array.filter((e) => {
        const selectedTags = tags.map((t) => t.id);
        const poolTags = e.Tags.map((t) => t.id);
        return _.difference(selectedTags, poolTags).length === 0;
      });

export const filterByPoolType = (poolType, array) =>
  !poolType ? array : array.filter((e) => e?.PoolType === poolType);

export const filterByStrategy = (strategy, array) =>
  !strategy ? array : array.filter((e) => e?.AllocationStrategy?.id === strategy.id);

export const filterByResourceType = (resourceType, array) =>
  !resourceType ? array : array.filter((e) => e?.ResourceType?.id === resourceType.id);
