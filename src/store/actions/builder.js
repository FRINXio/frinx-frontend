export const STORE_WORKFLOWS = 'STORE_WORKFLOWS';
export const UPDATE_BUILDER_QUERY = 'UPDATE_BUILDER_QUERY';
export const UPDATE_SEARCH_CATEGORY = 'UPDATE_TYPE';
export const UPDATE_WORKFLOWS = 'UPDATE_WORKFLOWS';
export const UPDATE_SIDEBAR = 'UPDATE_SIDEBAR';

export const storeWorkflows = (originalWorkflows) => {
    return {type: STORE_WORKFLOWS, originalWorkflows, workflows: originalWorkflows}
};

export const updateQuery = (query) => {
    return {type: UPDATE_BUILDER_QUERY, query}
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