import React, { FC, useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ExtendedTask, TaskDefinition, Workflow } from './helpers/types';
import App from './app';
import theme from './theme';
import { TaskActionsProvider } from './task-actions-context';
import { convertWorkflow } from './helpers/workflow.helpers';

type Props = {
  name?: string;
  version?: string;
  onClose: () => void;
  saveWorkflowCallback: (workflows: Workflow[]) => Promise<unknown>;
  getWorkflowCallback: (name: string, version: string) => Promise<Workflow>;
  getWorkflowsCallback: () => Promise<Workflow[]>;
  getTaskDefinitionsCallback: () => Promise<TaskDefinition[]>;
};

const Root: FC<Props> = ({
  name,
  version,
  onClose,
  saveWorkflowCallback,
  getWorkflowCallback,
  getWorkflowsCallback,
  getTaskDefinitionsCallback,
}) => {
  const [workflow, setWorkflow] = useState<Workflow<ExtendedTask> | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
  const [taskDefinitions, setTaskDefinitions] = useState<TaskDefinition[] | null>(null);

  useEffect(() => {
    if (name != null && version != null) {
      getWorkflowCallback(name, version).then((wf) => {
        setWorkflow(convertWorkflow(wf));
      });
    }
  }, [name, version, getWorkflowCallback]);

  useEffect(() => {
    getWorkflowsCallback().then((wfs) => {
      setWorkflows(wfs);
    });
  }, [getWorkflowsCallback]);

  useEffect(() => {
    getTaskDefinitionsCallback().then((tsks) => {
      setTaskDefinitions(tsks);
    });
  }, [getTaskDefinitionsCallback]);

  // useEffect(() => {
  //   const styleTag = document.createElement('style');
  //   styleTag.innerHTML = `.nodeLink path { stroke: ${theme.colors.gray[400]} !important; stroke-width: 0.25rem !important; } .bi.bi-diagram .bi.bi-diagram-node { z-index: 1 !important; }`;
  //   document.head.appendChild(styleTag);
  // }, []);

  return workflow != null && workflows != null && taskDefinitions != null ? (
    <ChakraProvider theme={theme}>
      <TaskActionsProvider>
        <App
          onClose={onClose}
          workflow={workflow}
          onWorkflowChange={setWorkflow}
          onWorkflowSave={saveWorkflowCallback}
          workflows={workflows}
          taskDefinitions={taskDefinitions}
        />
      </TaskActionsProvider>
    </ChakraProvider>
  ) : null;
};

export default Root;
