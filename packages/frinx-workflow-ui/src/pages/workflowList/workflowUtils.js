export const sortAscBy = (key) => {
  return function(x, y) {
    return x[key] === y[key] ? 0 : x[key] > y[key] ? 1 : -1;
  };
};

export const sortDescBy = (key) => {
  return function(x, y) {
    return x[key] === y[key] ? 0 : x[key] < y[key] ? 1 : -1;
  };
};
