import {fetchNewData} from "./searchExecs";

export const REQUEST_BULK_OPERATION = "REQUEST_BULK_OPERATION";
export const RECEIVE_BULK_OPERATION_RESPONSE = "RECEIVE_BULK_OPERATION_RESPONSE";
export const FAIL_BULK_OPERATION = "FAIL_BULK_OPERATION";
export const RESET_BULK_OPERATION_RESULT = "RESET_BULK_OPERATION_RESULT";

const http = require('../../server/HttpServerSide').HttpClient;

export const requestBulkOperation = () => {
    return {type: REQUEST_BULK_OPERATION}
};

export const receiveBulkOperationResponse = (successfulResults, errorResults) => {
    return dispatch => {
        dispatch(storeResponse(successfulResults, errorResults));
        dispatch(fetchNewData());
        setTimeout(() => dispatch(resetBulkOperationResult()), 2000)
    }
};

export const storeResponse = (successfulResults, errorResults) => {
    return {type: RECEIVE_BULK_OPERATION_RESPONSE, successfulResults, errorResults};
};

export const failBulkOperation = (error) => {
    return {type: FAIL_BULK_OPERATION, error};
};

export const resetBulkOperationResult = () => {
    return {type: RESET_BULK_OPERATION_RESULT}
};

export const checkDeleted = (deletedWfs, workflows) => {
    if (deletedWfs.length === workflows.length) {
        return dispatch => {
            dispatch(receiveBulkOperationResponse(deletedWfs, {}))
        }
    } else {
        return dispatch => {
            setTimeout(() => dispatch(checkDeleted(deletedWfs, workflows)), 200);
        }
    }
};

export const performBulkOperation = (operation, workflows) => {
    const url = `/api/conductor/bulk/${operation}`;
    let deletedWfs = [];

    return dispatch => {
        dispatch(requestBulkOperation());
        try {
            switch (operation) {
                case "retry":
                case "restart":
                    http.post(url, workflows).then(res => {
                        const {bulkSuccessfulResults, bulkErrorResults} = res.body.text ? JSON.parse(res.body.text) : [];
                        dispatch(receiveBulkOperationResponse(bulkSuccessfulResults, bulkErrorResults))
                    });
                    break;
                case "pause":
                case "resume":
                    http.put(url, workflows).then(res => {
                        const {bulkSuccessfulResults, bulkErrorResults} = res.body.text ? JSON.parse(res.body.text) : [];
                        dispatch(receiveBulkOperationResponse(bulkSuccessfulResults, bulkErrorResults))
                    });
                    break;
                case "terminate":
                    http.delete(url, workflows).then(res => {
                        const {bulkSuccessfulResults, bulkErrorResults} = res.body.text ? JSON.parse(res.body.text) : [];
                        dispatch(receiveBulkOperationResponse(bulkSuccessfulResults, bulkErrorResults))
                    });
                    break;
                case "delete":
                    workflows.map(wf => {
                        http.delete('/api/conductor/workflow/' + wf).then(() => {
                            deletedWfs.push(wf);
                        });
                        return null;
                    });
                    dispatch(checkDeleted(deletedWfs, workflows));
                    break;
                default:
                    dispatch(failBulkOperation("Invalid operation requested."))
            }
        } catch (e) {
            dispatch(failBulkOperation(e.message));
        }
    };
};
