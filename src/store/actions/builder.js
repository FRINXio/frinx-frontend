export const STORE_WORKFLOWS = 'STORE_WORKFLOWS';
export const UPDATE_BUILDER_QUERY = 'UPDATE_BUILDER_QUERY';
export const UPDATE_SEARCH_CATEGORY = 'UPDATE_TYPE';
export const UPDATE_WORKFLOWS = 'UPDATE_WORKFLOWS';
export const UPDATE_SIDEBAR = 'UPDATE_SIDEBAR';
export const UPDATE_FINAL_WORKFLOW = 'UPDATE_FINAL_WORKFLOW';
export const LOCK_WORKFLOW_NAME = 'LOCK_WORKFLOW_NAME';
export const SWITCH_SMART_ROUTING = 'SWITCH_SMART_ROUTING';

export const storeWorkflows = (originalWorkflows) => {
    return {type: STORE_WORKFLOWS, originalWorkflows, workflows: originalWorkflows}
};

export const updateQuery = (query) => {
    return {type: UPDATE_BUILDER_QUERY, query}
};

export const lockWorkflowName = () => {
    return {type: LOCK_WORKFLOW_NAME}
};

export const switchSmartRouting = () => {
  return {type: SWITCH_SMART_ROUTING}
};

export const updateCategory = (category) => {
    return {type: UPDATE_SEARCH_CATEGORY, category}
};

export const updateWorkflows = (workflows) => {
    return {type: UPDATE_WORKFLOWS, workflows}
};

export const updateSidebar = () => {
    return {type: UPDATE_SIDEBAR}
};

export const updateFinalWorkflow = (finalWorkflow) => {
    return {type: UPDATE_FINAL_WORKFLOW, finalWorkflow}
};

export const requestUpdateByQuery = (query) => {
    return (dispatch, getState) => {
        dispatch(updateQuery(query));

        let {originalWorkflows} = getState().buildReducer;
        let toBeUpdated = [];
        query = query.toUpperCase();

        if (query !== "") {
            for (let i = 0; i < originalWorkflows.length; i++) {
                if ((originalWorkflows[i]["name"] && originalWorkflows[i]["name"].toString().toUpperCase().indexOf(query) !== -1)) {
                    toBeUpdated.push(originalWorkflows[i]);
                }
            }
            dispatch(updateWorkflows(toBeUpdated))
        } else {
            dispatch(updateWorkflows(originalWorkflows));
        }
    }
};