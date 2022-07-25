export const truncateFromMiddle = (fullStr: string, strLen: number, middleStr = '...'): string => {
  if (fullStr.length <= strLen) {
    return fullStr;
  }
  const charsToShow = strLen - middleStr.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return [fullStr.substring(0, frontChars), middleStr, fullStr.substring(fullStr.length - backChars)].join('');
};
