// @flow
import './css/bootstrap.min.css';
import './css/awesomefonts.css';
import './css/neat.css';
import './css/mono-blue.min.css';
import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import buildReducer from './store/reducers/builder';
import bulkReducer from './store/reducers/bulk';
import searchReducer from './store/reducers/searchExecs';
import WorkflowDefsReadOnly from './pages/workflowList/WorkflowDefs/WorkflowDefsReadOnly';
import DiagramBuilder from './pages/diagramBuilder/DiagramBuilder';
import WorkflowExec from './pages/workflowList/WorkflowExec/WorkflowExec';
import PageContainer from './common/PageContainer';

const rootReducer = combineReducers({
  bulkReducer,
  searchReducer,
  buildReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const ServiceAppHeader = () => (
  <PageContainer>
    <h1 style={{ marginBottom: '20px' }}>
      <i style={{ color: 'grey' }} className="fas fa-cogs" />
      &nbsp;&nbsp;Service Portal
    </h1>
  </PageContainer>
);

function ServiceUIApp(props) {
  let { path } = useRouteMatch();

  return (
    <Provider store={store}>
      <Switch>
        <Route
          exact
          path={[path + '/builder', path + '/builder/:name/:version']}
          render={(props) => <DiagramBuilder {...props} />}
        />
        <>
          <ServiceAppHeader />
          <Route exact path={path + '/defs'}>
            <WorkflowDefsReadOnly />
          </Route>
          <Route
            exact
            path={path + '/exec/:wfid?'}
            render={(props) => <WorkflowExec query={props.match.params.wfid} />}
          />
        </>
        <Redirect to={path + '/defs'} />
      </Switch>
    </Provider>
  );
}

export default ServiceUIApp;
