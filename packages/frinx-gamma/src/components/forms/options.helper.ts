type OptionItem = {
  key: string;
  label: string;
};

export function getSelectOptions(options: Options): OptionItem[] {
  return Object.entries(options).map(([key, label]) => ({
    key,
    label: String(label),
  }));
}
