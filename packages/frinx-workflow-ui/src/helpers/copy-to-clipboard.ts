// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (textToCopy: any) => {
  navigator.clipboard.writeText(JSON.stringify(textToCopy));
};
