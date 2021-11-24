import { FC } from 'react';
import { UniflowApiCallbacks } from './src/uniflow-api-provider';

declare module '@frinx/workflow-ui' {
  export const ReduxProvider: FC;
  export const getUniflowApiProvider: (callbacks: UniflowApiCallbacks) => FC;
  export const UniflowApiProvider: FC;
  export const WorkflowListHeader: FC<{ onAddButtonClick: () => void; onImportSuccess: () => void }>;
  export const WorkflowDefinitions: FC<{
    onDefinitionClick: (name: string, version: string) => void;
    onWorkflowIdClick: (wfId: string) => void;
  }>;
  export const ExecutedWorkflowList: FC<{ onWorkflowIdClick: (workflowId: string) => void }>;
  export const ExecutedWorkflowDetail: FC<{
    workflowId: string;
    onWorkflowIdClick: (workflowId: string) => void;
    onExecutedOperation: () => void;
  }>;
  export const ScheduledWorkflowList: FC;
  export const EventListeners: FC;
  export const TaskList: FC;
  export const PollData: FC;
  export const DiagramBuilder: FC<{
    name?: string;
    version?: string;
    onExitBtnClick: () => void;
    onNewBtnClick: () => void;
    onWorkflowIdClick: (wfId: string) => void;
  }>;
}
