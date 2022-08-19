export default (textToCopy: any) => {
  navigator.clipboard.writeText(JSON.stringify(textToCopy));
};
