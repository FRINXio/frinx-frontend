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
import WorkflowListHeader from './pages/workflow-list/workflow-list-header';
import buildReducer from './store/reducers/builder';
import bulkReducer from './store/reducers/bulk';
import searchReducer from './store/reducers/searchExecs';
import WorkflowDefinitions from './pages/workflow-list/WorkflowDefs/workflow-definitions';
import WorkflowExec from './pages/workflow-list/executed-workflow-list/executed-workflow-list';
import ScheduledWorkflowList from './pages/workflow-list/scheduled-workflow/scheduled-workflow-list';
import EventListeners from './pages/workflow-list/EventListeners/event-listeners';
import TaskList from './pages/workflow-list/Tasks/task-list';
import PollData from './pages/workflow-list/PollData/poll-data';
import { getUniflowApiProvider } from './uniflow-api-provider';

const rootReducer = combineReducers({
  bulkReducer,
  searchReducer,
  buildReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const callbacks = {
  //...
};

const UniflowApiProvider = getUniflowApiProvider(callbacks);

function App() {
  let { path } = useRouteMatch();

  return (
    <UniflowApiProvider>
      <Provider store={store}>
        <Switch>
          <>
            <WorkflowListHeader onAddButtonClick={() => {}} />
            <Route exact path={path + '/defs'}>
              <WorkflowDefinitions />
            </Route>
            <Route
              exact
              path={path + '/exec/:wfid?'}
              render={(props) => <WorkflowExec query={props.match.params.wfid} />}
            />
            <Route exact path={path + '/scheduled'}>
              <ScheduledWorkflowList />
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
            <Redirect from={path} to={path + '/defs'} />
          </>
        </Switch>
      </Provider>
    </UniflowApiProvider>
  );
}

export default App;
