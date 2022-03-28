type OptionItem = {
  key: string;
  label: string;
};

export function getSelectOptions(options: Record<string, string>): OptionItem[] {
  return Object.entries(options).map(([key, label]) => ({
    key,
    label: String(label),
  }));
}
