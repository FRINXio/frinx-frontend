export const hasOperationName = (req, operationName: string): boolean => {
  const { body } = req;
  return Object.prototype.hasOwnProperty.call(body, 'operationName') && body.operationName === operationName;
};
