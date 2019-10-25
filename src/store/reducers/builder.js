import {
  LOCK_WORKFLOW_NAME,
  RESET_TO_DEFAULT_WORKFLOW,
  SHOW_CUSTOM_ALERT,
  STORE_WORKFLOW_ID,
  STORE_WORKFLOWS,
  SWITCH_SMART_ROUTING,
  UPDATE_BUILDER_QUERY,
  UPDATE_FINAL_WORKFLOW,
  UPDATE_WORKFLOWS
} from "../actions/builder";

const finalWorkflowTemplate = {
  name: "",
  description: "",
  version: 1,
  tasks: [],
  outputParameters: {},
  inputParameters: [],
  schemaVersion: 2,
  restartable: true,
  workflowStatusListenerEnabled: false
};

const initialState = {
  workflows: [],
  functional: ["start", "end", "fork", "join", "decision"],
  originalWorkflows: [],
  query: "",
  workflowNameLock: false,
  switchSmartRouting: false,
  executedWfId: null,
  customAlert: {
    show: false,
    variant: "danger",
    msg: ""
  },
  finalWorkflow: {
    name: "",
    description: "",
    version: 1,
    tasks: [],
    outputParameters: {},
    inputParameters: [],
    schemaVersion: 2,
    restartable: true,
    workflowStatusListenerEnabled: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BUILDER_QUERY: {
      let { query } = action;
      return { ...state, query };
    }
    case STORE_WORKFLOWS: {
      const { originalWorkflows, workflows } = action;
      return { ...state, originalWorkflows, workflows };
    }
    case UPDATE_WORKFLOWS: {
      const { workflows } = action;
      return { ...state, workflows };
    }
    case RESET_TO_DEFAULT_WORKFLOW: {
      return {
        ...state,
        finalWorkflow: finalWorkflowTemplate,
        workflowNameLock: false
      };
    }
    case STORE_WORKFLOW_ID: {
      const { executedWfId } = action;
      return { ...state, executedWfId };
    }
    case LOCK_WORKFLOW_NAME: {
      return { ...state, workflowNameLock: true };
    }
    case SWITCH_SMART_ROUTING: {
      const { switchSmartRouting } = state;
      return { ...state, switchSmartRouting: !switchSmartRouting };
    }
    case UPDATE_FINAL_WORKFLOW: {
      let { finalWorkflow } = action;
      return { ...state, finalWorkflow };
    }
    case SHOW_CUSTOM_ALERT: {
      let { show, variant, msg } = action;
      return { ...state, customAlert: { show, variant, msg } };
    }
    default:
      break;
  }
  return state;
};

export default reducer;
