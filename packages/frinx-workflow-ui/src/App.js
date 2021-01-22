// @flow
import './css/bootstrap.min.css';
import './css/awesomefonts.css';
import './css/neat.css';
import './css/mono-blue.min.css';
import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch, useParams } from 'react-router-dom';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import DiagramBuilder from './pages/diagramBuilder/DiagramBuilder';
import WorkflowListHeader from './pages/workflowList/WorkflowListHeader';
import buildReducer from './store/reducers/builder';
import bulkReducer from './store/reducers/bulk';
import searchReducer from './store/reducers/searchExecs';
import { GlobalProvider } from './common/GlobalContext';
import WorkflowDefs from './pages/workflowList/WorkflowDefs/WorkflowDefinitions';
import WorkflowExec from './pages/workflowList/WorkflowExec/WorkflowExec';
import Scheduling from './pages/workflowList/Scheduling/Scheduling';
import EventListeners from './pages/workflowList/EventListeners/EventListeners';
import TaskList from './pages/workflowList/Tasks/TaskList';
import PollData from './pages/workflowList/PollData/PollData';

const rootReducer = combineReducers({
  bulkReducer,
  searchReducer,
  buildReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// TODO iterate over this to render routes in <Switch>
export const routes = [
  { label: 'Definitions', path: '/defs' },
  { label: 'Executed', path: '/exec/:wfid?' },
  { label: 'Scheduled', path: '/scheduled' },
  { label: 'Event Listeners', path: '/eventlisteners' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Poll Data', path: '/polldata' },
];

function App(props) {
  let { path } = useRouteMatch();

  return (
    <GlobalProvider {...props}>
      <Provider store={store}>
        <Switch>
          <Route
            exact
            path={[path + '/builder', path + '/builder/:name/:version']}
            render={props => <DiagramBuilder {...props} />}
          />
          <>
            <WorkflowListHeader />
            <Route exact path={path + '/defs'}>
              <WorkflowDefinitions />
            </Route>
            <Route
              exact
              path={path + '/exec/:wfid?'}
              render={props => <WorkflowExec query={props.match.params.wfid} />}
            />
            <Route exact path={path + '/scheduled'}>
              <Scheduling />
            </Route>
            <Route exact path={path + '/eventlisteners'}>
              <EventListeners />
            </Route>
            <Route exact path={path + '/tasks'}>
              <TaskList />
            </Route>
            <Route exact path={path + '/polldata'}>
              <PollData />
            </Route>
          </>
          <Redirect to={path + '/defs'} />
        </Switch>
      </Provider>
    </GlobalProvider>
  );
}

export default App;
