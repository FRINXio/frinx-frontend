export const sortAscBy = (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: Record<string, any>, y: Record<string, any>) => {
    if (x[key] < y[key]) {
      return -1;
    }
    if (x[key] > y[key]) {
      return 1;
    }
    return 0;
  };
};

export const sortDescBy = (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: Record<string, any>, y: Record<string, any>) => {
    if (x[key] > y[key]) {
      return -1;
    }
    if (x[key] < y[key]) {
      return 1;
    }
    return 0;
  };
};
