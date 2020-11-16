export const filterByQuery = (searchQuery, array) => (!searchQuery
  ? array
  : array.filter((e) => {
    const searchedKeys = ['Name'];

    for (let i = 0; i < searchedKeys.length; i += 1) {
      if (
        e[searchedKeys[i]]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      ) {
        return true;
      }
    }
    return false;
  }));
export const filterByPool = (pool, array) => (!pool
  ? array
  : array.filter((e) => e?.Pools.map((p) => {
    console.log(p.Name === pool.Name, p, pool);
    return p.Name === pool.Name;
  }).length > 0));
