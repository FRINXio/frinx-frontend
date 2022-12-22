import { CyHttpMessages } from 'cypress/types/net-stubbing';

export const hasOperationName = (req: CyHttpMessages.IncomingRequest, operationName: string): boolean => {
  const { body } = req;
  return body.hasOwnProperty('operationName') && body.operationName === operationName;
};
