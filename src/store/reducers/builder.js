import {
    LOCK_WORKFLOW_NAME, RESET_TO_DEFAULT_WORKFLOW, STORE_WORKFLOW_ID,
    STORE_WORKFLOWS, SWITCH_SMART_ROUTING,
    UPDATE_BUILDER_QUERY, UPDATE_FINAL_WORKFLOW,
    UPDATE_SEARCH_CATEGORY,
    UPDATE_SIDEBAR,
    UPDATE_WORKFLOWS
} from "../actions/builder";

const finalWorkflowTemplate = {
    updateTime: 1563176250520,
    name: "",
    description: "",
    version: 1,
    tasks: [],
    outputParameters: {
        mount: "${check_mounted.output.mount}",
    },
    schemaVersion: 2,
    restartable: true,
    workflowStatusListenerEnabled: false
};

const initialState = {
    workflows: [],
    functional: ["start", "end"],
    originalWorkflows: [],
    query: "",
    category: "Workflows",
    sidebarShown: true,
    workflowNameLock: false,
    switchSmartRouting: false,
    executedWfId: null,
    finalWorkflow: {
        updateTime: 1563176250520,
        name: "",
        description: "",
        version: 1,
        tasks: [],
        outputParameters: {
            mount: "${check_mounted.output.mount}",
        },
        schemaVersion: 2,
        restartable: true,
        workflowStatusListenerEnabled: false
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_BUILDER_QUERY: {
            let {query} = action;
            return {...state, query}
        }
        case STORE_WORKFLOWS: {
            const {originalWorkflows, workflows} = action;
            return {
                ...state,
                originalWorkflows,
                workflows,
                workflowNameLock: false
            }
        }
        case UPDATE_WORKFLOWS: {
            const {workflows} = action;
            return {...state, workflows}
        }
        case RESET_TO_DEFAULT_WORKFLOW: {
            return {...state, finalWorkflow: finalWorkflowTemplate}
        }
        case STORE_WORKFLOW_ID: {
            const {executedWfId} = action;
            return {...state, executedWfId}
        }
        case UPDATE_SEARCH_CATEGORY: {
            const {category} = action;
            return {...state, category}
        }
        case LOCK_WORKFLOW_NAME: {
            return {...state, workflowNameLock: true}
        }
        case SWITCH_SMART_ROUTING: {
            const {switchSmartRouting} = state;
            return {...state, switchSmartRouting: !switchSmartRouting}
        }
        case UPDATE_SIDEBAR: {
            const {sidebarShown} = state;
            return {...state, sidebarShown: !sidebarShown }
        }
        case UPDATE_FINAL_WORKFLOW: {
            let {finalWorkflow} = action;
            return {...state, finalWorkflow}
        }
        default: break;
    }
    return state;
};

export default reducer;
