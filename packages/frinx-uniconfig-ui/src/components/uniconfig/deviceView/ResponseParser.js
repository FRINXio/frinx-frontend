export function parseResponse(type, body) {
  let { configuration, nodeStatus, errorMessage, errorType } = '';
  let overallStatus = body['output']['overall-status'];

  if (body['output']['node-results']) {
    nodeStatus = body['output']['node-results']['node-result']['0']['configuration-status']
      ? body['output']['node-results']['node-result']['0']['configuration-status']
      : body['output']['node-results']['node-result']['0']['status'];
    errorMessage = body['output']['node-results']['node-result']['0']['error-message'];
    errorType = body['output']['node-results']['node-result']['0']['error-type'];
    configuration = body['output']['node-results']['node-result']['0']['configuration'];
  } else {
    errorMessage = body['output']['error-message'];
  }
  return {
    type,
    overallStatus,
    nodeStatus,
    errorMessage,
    errorType,
    configuration,
  };
}
