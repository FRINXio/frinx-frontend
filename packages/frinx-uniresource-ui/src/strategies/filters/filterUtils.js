export const filterByQuery = (searchQuery, array) =>
  !searchQuery
    ? array
    : array.filter((e) => {
        const searchedKeys = ['Name', 'Lang', 'Script'];

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
      });

export const filterByLang = (lang, array) => (!lang ? array : array.filter((e) => e?.Lang === lang));
