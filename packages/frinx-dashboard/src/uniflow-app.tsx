import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory, RouteComponentProps } from 'react-router-dom';
import { WorkflowBuilder } from '@frinx/workflow-builder/src';
import { putWorkflow, getWorkflow } from './api/uniflow/uniflow-api';

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/workflow-ui') | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/workflow-ui').then((mod) => {
      const {
        ReduxProvider,
        WorkflowListHeader,
        WorkflowDefinitions,
        WorkflowExec,
        Scheduling,
        EventListeners,
        TaskList,
        PollData,
        DiagramBuilder,
      } = mod;
      setComponents({
        ReduxProvider,
        WorkflowListHeader,
        WorkflowDefinitions,
        WorkflowExec,
        Scheduling,
        EventListeners,
        TaskList,
        PollData,
        DiagramBuilder,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    ReduxProvider,
    WorkflowListHeader,
    WorkflowDefinitions,
    WorkflowExec,
    Scheduling,
    EventListeners,
    TaskList,
    PollData,
    DiagramBuilder,
  } = components;

  return (
    <ReduxProvider>
      <Switch>
        <Route exact path="/uniflow">
          <Redirect to="/uniflow/definitions" />
        </Route>
        <Route
          exact
          path="/uniflow/builder/:name?/:version?"
          render={(props: RouteComponentProps<{ name?: string; version?: string }>) => {
            const { match } = props;

            return (
              <WorkflowBuilder name={match.params.name} version={match.params.version} getWorkflowCallback={getWorkflow} saveWorkflowCallback={putWorkflow} />
              // <DiagramBuilder
              //   name={match.params.name}
              //   version={match.params.version}
              //   onExitBtnClick={() => {
              //     history.push('/uniflow/definitions');
              //   }}
              //   onNewBtnClick={() => {
              //     history.push('/uniflow/builder');
              //     // this is an ugly hack for now
              //     window.location.reload();
              //   }}
              // />
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
            render={(props: RouteComponentProps<{ wfId?: string }>) => {
              return <WorkflowExec query={props.match.params.wfId} />;
            }}
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
