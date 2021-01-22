import React, { FC } from 'react';
import { Route, Switch, Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import {
  ReduxProvider,
  WorkflowListHeader,
  WorkflowDefinitions,
  WorkflowExec,
  Scheduling,
  EventListeners,
  TaskList,
  PollData,
  DiagramBuilder,
} from '@frinx/workflow-ui/src';

const UniflowApp: FC = () => {
  const history = useHistory();
  const { params } = useRouteMatch();
  console.log(params);

  return (
    <ReduxProvider>
      <Switch>
        <Route exact path="/uniflow">
          <Redirect to="/uniflow/definitions" />
        </Route>
        <Route
          exact
          path="/uniflow/builder/:name?/:version?"
          render={(props) => {
            const { match } = props;
            return (
              <DiagramBuilder
                name={match.params.name}
                version={match.params.version}
                onExitBtnClick={() => {
                  history.push('/uniflow/definitions');
                }}
                onNewBtnClick={() => {
                  history.push('/uniflow/builder');
                  // this is an ugly hack for now
                  window.location.reload();
                }}
              />
            );
          }}
        />
        <>
          <WorkflowListHeader
            onAddButtonClick={() => {
              history.push('/uniflow/builder');
            }}
          />
          <Route exact path="/uniflow/definitions">
            <WorkflowDefinitions
              onDefinitionClick={(name: string, version: string) => {
                history.push(`/uniflow/builder/${name}/${version}`);
              }}
            />
          </Route>
          <Route
            exact
            path="/uniflow/executed/:wfId?"
            render={(props) => <WorkflowExec query={props.match.params.wfId} />}
          />
          <Route exact path="/uniflow/scheduled">
            <Scheduling />
          </Route>
          <Route exact path="/uniflow/event-listeners">
            <EventListeners />
          </Route>
          <Route exact path="/uniflow/tasks">
            <TaskList />
          </Route>
          <Route exact path="/uniflow/poll-data">
            <PollData />
          </Route>
        </>
      </Switch>
    </ReduxProvider>
  );
};

export default UniflowApp;
