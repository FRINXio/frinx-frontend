import React, { FC, useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Workflow } from 'helpers/types';
import App from './app';

type Props = {
  name?: string;
  version?: string;
  onClose: () => void;
  saveWorkflowCallback: (workflows: Workflow[]) => Promise<unknown>;
  getWorkflowCallback: (name: string, version: string) => Promise<Workflow>;
};

const Root: FC<Props> = ({ name, version, onClose, saveWorkflowCallback, getWorkflowCallback }) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  useEffect(() => {
    if (name != null && version != null) {
      getWorkflowCallback(name, version).then((wf) => {
        setWorkflow(wf);
      });
    }
  }, [name, version, getWorkflowCallback]);

  return workflow != null ? (
    <ChakraProvider>
      <App onClose={onClose} workflow={workflow} onWorkflowSave={saveWorkflowCallback} />
    </ChakraProvider>
  ) : null;
};

export default Root;
