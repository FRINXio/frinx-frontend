// @flow
import App from './App';
import ServiceUIApp from './ServiceUiApp';

export { ServiceUIApp };
export { App as WorkflowApp };

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
