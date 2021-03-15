// @flow
import App from './App';
import ServiceUIApp from './ServiceUiApp';
import WorkflowListHeader from './pages/workflowList/workflow-list-header';
import WorkflowDefinitions from './pages/workflowList/WorkflowDefs/workflow-definitions';
import ReduxProvider from './ReduxProvider';
import { getUniflowApiProvider } from './UniflowApiProvider';
import WorkflowExec from './pages/workflowList/WorkflowExec/workflow-exec';
import Scheduling from './pages/workflowList/Scheduling/Scheduling';
import EventListeners from './pages/workflowList/EventListeners/event-listeners';
import TaskList from './pages/workflowList/Tasks/task-list';
import PollData from './pages/workflowList/PollData/poll-data';
import DiagramBuilder from './pages/diagramBuilder/DiagramBuilder';

export { ServiceUIApp };
export { App as WorkflowApp };
export { WorkflowListHeader };
export { WorkflowDefinitions };
export { ReduxProvider };
export { getUniflowApiProvider };
export { WorkflowExec };
export { Scheduling };
export { EventListeners };
export { TaskList };
export { PollData };
export { DiagramBuilder };

export const menuLinks = [
  { label: 'Definitions', path: '/defs' },
  { label: 'Executed', path: '/exec' },
  { label: 'Scheduled', path: '/scheduled' },
  { label: 'Event Listeners', path: '/eventlisteners' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Poll Data', path: '/polldata' },
];

export default {
  RootComponent: App,
  menuLinks,
};
