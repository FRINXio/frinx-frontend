// @flow
import App from './App';
import WorkflowListHeader from './pages/workflow-list/workflow-list-header';
import WorkflowDefinitions from './pages/workflow-list/WorkflowDefs/workflow-definitions';
import { getUniflowApiProvider } from './uniflow-api-provider';
import ExecutedWorkflowList from './pages/workflow-list/executed-workflow-list/executed-workflow-list';
import ExecutedWorkflowDetail from './pages/executed-workflow-detail/executed-workflow-detail';
import ScheduledWorkflowList from './pages/workflow-list/scheduled-workflow/scheduled-workflow-list';
import EventListeners from './pages/workflow-list/EventListeners/event-listeners';
import TaskList from './pages/workflow-list/Tasks/task-list';
import PollData from './pages/workflow-list/PollData/poll-data';

export { WorkflowListHeader };
export { WorkflowDefinitions };
export { getUniflowApiProvider };
export { ExecutedWorkflowList };
export { ExecutedWorkflowDetail };
export { ScheduledWorkflowList };
export { EventListeners };
export { TaskList };
export { PollData };

export const menuLinks = [
  { label: 'Definitions', path: '/defs' },
  { label: 'Executed', path: '/exec' },
  { label: 'Scheduled', path: '/scheduled' },
  { label: 'Event Listeners', path: '/eventlisteners' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Poll Data', path: '/polldata' },
];

export default {
  menuLinks,
};
