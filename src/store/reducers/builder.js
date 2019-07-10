import {
    STORE_WORKFLOWS,
    UPDATE_BUILDER_QUERY,
    UPDATE_SEARCH_CATEGORY,
    UPDATE_SIDEBAR,
    UPDATE_WORKFLOWS
} from "../actions/builder";

const initialState = {
    workflows: [],
    functional: ["start", "end"],
    originalWorkflows: [],
    query: "",
    category: "Workflows",
    sidebarShown: true,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_BUILDER_QUERY: {
            let {query} = action;
            return {...state, query}
        }
        case STORE_WORKFLOWS: {
            const {originalWorkflows, workflows} = action;
            return {...state, originalWorkflows, workflows}
        }
        case UPDATE_WORKFLOWS: {
            const {workflows} = action;
            return {...state, workflows}
        }
        case UPDATE_SEARCH_CATEGORY: {
            const {category} = action;
            return {...state, category}
        }
        case UPDATE_SIDEBAR: {
            const {sidebarShown} = state;
            return {...state, sidebarShown: !sidebarShown }
        }
        default: break;
    }
    return state;
};

export default reducer;
