import { FC } from 'react';
import { UniflowApiCallbacks } from './src/UniflowApiProvider';

declare module '@frinx/workflow-ui' {
  export const ReduxProvider: FC;
  export const getUniflowApiProvider: (callbacks: UniflowApiCallbacks) => FC;
  export const UniflowApiProvider: FC;
  export const WorkflowListHeader: FC<{ onAddButtonClick: () => void }>;
  export const WorkflowDefinitions: FC<{
    onDefinitionClick: (name: string, version: string) => void;
    onWorkflowIdClick: (wfId: string) => void;
  }>;
  export const WorkflowExec: FC<{ query?: string; onWorkflowIdClick: (wfId: string) => void }>;
  export const Scheduling: FC;
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
