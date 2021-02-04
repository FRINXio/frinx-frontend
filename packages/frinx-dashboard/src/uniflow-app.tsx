import { getWorkflows, getWorkflow, getTaskDefinitions, registerEventListener, putWorkflow } from './api/uniflow/uniflow-api';
import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory, RouteComponentProps } from 'react-router-dom';

const callbacks = {
  getWorkflows,
  getWorkflow,
  getTaskDefinitions,
  registerEventListener,
  putWorkflow
}

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
        getUniflowApiProvider
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
        getUniflowApiProvider,
        UniflowApiProvider: getUniflowApiProvider(callbacks)
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
    UniflowApiProvider
  } = components;

  return (
    <UniflowApiProvider>
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
                  onWorkflowIdClick={(wfId: string) => {
                    history.push(`/uniflow/executed/${wfId}`);
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
                onWorkflowIdClick={(wfId: string) => {
                  history.push(`/uniflow/executed/${wfId}`);
                }}
              />
            </Route>
            <Route
              exact
              path="/uniflow/executed/:wfId?"
              render={(props: RouteComponentProps<{ wfId?: string }>) => {
                return (
                  <WorkflowExec
                    query={props.match.params.wfId}
                    onWorkflowIdClick={(wfId: string) => {
                      history.push(`/uniflow/executed/${wfId}`);
                    }}
                  />
                );
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
    </UniflowApiProvider>
  );
};

export default UniflowApp;
