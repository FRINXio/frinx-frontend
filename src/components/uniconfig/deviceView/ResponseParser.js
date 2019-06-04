export function parseResponse(type, body) {

    let bodyJSON = JSON.parse(body);

    console.log(bodyJSON);


    switch (type) {
        case "dryrun": return parseDryRun(type, bodyJSON);
        case "sync": return parseSync(type, bodyJSON);
        default: break;
    }
}

function parseDryRun(type, bodyJSON) {

    let {overallStatus, configuration, nodeStatus, errorMessage, errorType} = "";
    overallStatus = bodyJSON["output"]["overall-configuration-status"];

    if (bodyJSON["output"]["node-config-results"]) {
        nodeStatus = bodyJSON["output"]["node-config-results"]["node-config-result"]["0"]["configuration-status"];
        errorMessage = bodyJSON["output"]["node-config-results"]["node-config-result"]["0"]["error-message"];
        errorType = bodyJSON["output"]["node-config-results"]["node-config-result"]["0"]["error-type"];
        configuration = bodyJSON["output"]["node-config-results"]["node-config-result"]["0"]["configuration"];

    }
    return {type, overallStatus, nodeStatus, errorMessage, errorType, configuration}
}

function parseSync(type, bodyJSON) {
    let {nodeId, status} = "";
    if (bodyJSON["output"]["node-sync-status-results"]["node-sync-status-result"]){
        nodeId = bodyJSON["output"]["node-sync-status-results"]["node-sync-status-result"][0]["nodeId"];
        status = "updated with changes"
    } else if (bodyJSON["output"]["node-sync-status-results"]) {
        status = "without changes"
    } else {
        status = "error"
    }
    return {type, nodeId, status}
}