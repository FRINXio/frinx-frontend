// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (textToCopy: any) => {
  await navigator.clipboard.writeText(JSON.stringify(textToCopy));
};
