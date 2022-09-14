export const sortAscBy = (key: string) => {
  return function (x: Record<string, any>, y: Record<string, any>) {
    return x[key] === y[key] ? 0 : x[key] > y[key] ? 1 : -1;
  };
};

export const sortDescBy = (key: string) => {
  return function (x: Record<string, any>, y: Record<string, any>) {
    return x[key] === y[key] ? 0 : x[key] < y[key] ? 1 : -1;
  };
};

export const jsonParse = (json?: string | null) => {
  if (json == null) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};
