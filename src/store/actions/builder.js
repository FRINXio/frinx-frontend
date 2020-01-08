import * as _ from "lodash";

export const STORE_WORKFLOWS = "STORE_WORKFLOWS";
export const UPDATE_BUILDER_QUERY = "UPDATE_BUILDER_QUERY";
export const UPDATE_BUILDER_LABELS = "UPDATE_BUILDER_LABELS";
export const UPDATE_WORKFLOWS = "UPDATE_WORKFLOWS";
export const UPDATE_FINAL_WORKFLOW = "UPDATE_FINAL_WORKFLOW";
export const LOCK_WORKFLOW_NAME = "LOCK_WORKFLOW_NAME";
export const SWITCH_SMART_ROUTING = "SWITCH_SMART_ROUTING";
export const RESET_TO_DEFAULT_WORKFLOW = "RESET_TO_DEFAULT_WORKFLOW";
export const STORE_WORKFLOW_ID = "STORE_WORKFLOW_ID";
export const SHOW_CUSTOM_ALERT = "SHOW_CUSTOM_ALERT";

export const storeWorkflows = originalWorkflows => {
  return {
    type: STORE_WORKFLOWS,
    originalWorkflows,
    workflows: originalWorkflows
  };
};

export const updateQuery = query => {
  return { type: UPDATE_BUILDER_QUERY, query };
};

export const updateLabels = labels => {
  return { type: UPDATE_BUILDER_LABELS, labels };
};

export const showCustomAlert = (show, variant = "danger", msg) => {
  return { type: SHOW_CUSTOM_ALERT, show, variant, msg };
};

export const storeWorkflowId = id => {
  return { type: STORE_WORKFLOW_ID, executedWfId: id };
};

export const lockWorkflowName = () => {
  return { type: LOCK_WORKFLOW_NAME };
};

export const resetToDefaultWorkflow = () => {
  return { type: RESET_TO_DEFAULT_WORKFLOW };
};

export const switchSmartRouting = () => {
  return { type: SWITCH_SMART_ROUTING };
};

export const updateWorkflows = workflows => {
  return { type: UPDATE_WORKFLOWS, workflows };
};

export const updateFinalWorkflow = finalWorkflow => {
  return { type: UPDATE_FINAL_WORKFLOW, finalWorkflow };
};

export const requestUpdateByQuery = (queryIn, labelsIn) => {
  return (dispatch, getState) => {
    
    let { originalWorkflows, query, labels } = getState().buildReducer;
    console.log(query, labels);
    let withLabels = [];
    let toBeUpdated = [];

    if (queryIn === null) {
      queryIn = query;
    }
    if (labelsIn === null) {
      labelsIn = labels;
    }

    dispatch(updateQuery(queryIn));
    dispatch(updateLabels(labelsIn));

    console.log(queryIn, labelsIn)

    // label filter
    if (labelsIn && labelsIn.length > 0) {
      originalWorkflows.forEach(wf => {
        if (wf.description) {
          let wfLabels = wf.description
            .split("-")
            .pop()
            .replace(/\s/g, "")
            .split(",");

          if (_.intersection(wfLabels, labelsIn).length === labelsIn.length) {
            withLabels.push(wf);
          }
        }
      });
    } else {
      withLabels = originalWorkflows;
    }

    // query filter
    if (queryIn && queryIn !== "") {
      withLabels.forEach(wf => {
        if (
          wf["name"] &&
          wf["name"]
            .toString()
            .toUpperCase()
            .indexOf(queryIn.toUpperCase()) !== -1
        ) {
          toBeUpdated.push(wf);
        }
      });
    } else {
      toBeUpdated = withLabels;
    }

    dispatch(updateWorkflows(toBeUpdated));
  };
};
