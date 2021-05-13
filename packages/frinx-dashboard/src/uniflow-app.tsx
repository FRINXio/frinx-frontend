import React, { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { Route, Switch, Redirect, useHistory, RouteComponentProps } from 'react-router-dom';
// import { WorkflowBuilder } from '@frinx/workflow-builder/src';
import {
  getWorkflows,
  getWorkflow,
  getTaskDefinitions,
  getTaskDefinition,
  registerTaskDefinition,
  deleteTaskDefinition,
  registerEventListener,
  putWorkflow,
  getEventListeners,
  deleteEventListener,
  getQueues,
  deleteWorkflow,
  getWorkflowExecutions,
  getWorkflowInstanceDetail,
  executeWorkflow,
  getWorkflowExecutionsHierarchical,
  terminateWorkflows,
  pauseWorkflows,
  resumeWorkflows,
  retryWorkflows,
  restartWorkflows,
  deleteWorkflowInstance,
  getSchedules,
  deleteSchedule,
  getSchedule,
  registerSchedule,
} from './api/uniflow/uniflow-api';

const callbacks = {
  getWorkflows,
  getWorkflow,
  getTaskDefinitions,
  getTaskDefinition,
  registerTaskDefinition,
  deleteTaskDefinition,
  registerEventListener,
  putWorkflow,
  getEventListeners,
  deleteEventListener,
  getQueues,
  deleteWorkflow,
  getWorkflowExecutions,
  getWorkflowInstanceDetail,
  executeWorkflow,
  getWorkflowExecutionsHierarchical,
  terminateWorkflows,
  pauseWorkflows,
  resumeWorkflows,
  retryWorkflows,
  restartWorkflows,
  deleteWorkflowInstance,
  getSchedules,
  deleteSchedule,
  getSchedule,
  registerSchedule,
};

type UniflowComponents = Omit<typeof import('@frinx/workflow-ui'), 'getUniflowApiProvider'> & {
  UniflowApiProvider: FC;
};
type BuilderComponents = Omit<typeof import('@frinx/workflow-builder/src'), 'getBuilderApiProvider'> & {
  BuilderApiProvider: FC;
};

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<(UniflowComponents & BuilderComponents) | null>(null);
  const history = useHistory();
  const [key, setKey] = useState(uuid());

  useEffect(() => {
    Promise.all([import('@frinx/workflow-ui'), import('@frinx/workflow-builder/src')]).then(
      ([uniflowImport, builderImport]) => {
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
          getUniflowApiProvider,
        } = uniflowImport;
        const { WorkflowBuilder, getBuilderApiProvider } = builderImport;

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
          UniflowApiProvider: getUniflowApiProvider(callbacks),
          WorkflowBuilder,
          BuilderApiProvider: getBuilderApiProvider(callbacks),
        });
      },
    );
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
    UniflowApiProvider,
    WorkflowBuilder,
    BuilderApiProvider,
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
              const { params } = match;

              return (
                <Box marginTop={-10} height="calc(100vh - 64px)">
                  <BuilderApiProvider>
                    <WorkflowBuilder
                      key={`${params.name}/${params.version}`}
                      name={params.name}
                      version={params.version}
                      onClose={() => {
                        history.push('/uniflow/definitions');
                      }}
                      onExecuteSuccessClick={(workflowId) => {
                        history.push(`/uniflow/executed/${workflowId}`);
                      }}
                      onEditWorkflowClick={(name, version) => {
                        history.push(`/uniflow/builder/${name}/${version}`);
                      }}
                      onNewWorkflowClick={() => {
                        history.push('/uniflow/builder');
                      }}
                    />
                  </BuilderApiProvider>
                </Box>
              );
            }}
          />
          <>
            <WorkflowListHeader
              onAddButtonClick={() => {
                history.push('/uniflow/builder');
              }}
              onImportSuccess={() => {
                setKey(uuid());
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
                key={key}
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
