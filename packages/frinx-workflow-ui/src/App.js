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
import WorkflowDefinitions from './pages/workflowList/WorkflowDefs/WorkflowDefinitions';
import WorkflowExec from './pages/workflowList/WorkflowExec/WorkflowExec';
import Scheduling from './pages/workflowList/Scheduling/Scheduling';
import EventListeners from './pages/workflowList/EventListeners/EventListeners';
import TaskList from './pages/workflowList/Tasks/TaskList';
import PollData from './pages/workflowList/PollData/PollData';
import { getUniflowApiProvider } from './UniflowApiProvider';

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
          <Route
            exact
            path={[path + '/builder', path + '/builder/:name/:version']}
            render={(props) => <DiagramBuilder {...props} />}
          />
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
            <Redirect from={path} to={path + '/defs'} />
          </>
        </Switch>
      </Provider>
    </UniflowApiProvider>
  );
}

export default App;
