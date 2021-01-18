import React, { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Workflow } from 'helpers/types';
import App from './app';
import { TaskProvider } from './workflow-context';

type Props = {
  workflow: Workflow;
  onClose: () => void;
};

const Root: FC<Props> = ({ workflow, onClose }) => {
  return (
    <ChakraProvider>
      <TaskProvider workflow={workflow}>
        <App onClose={onClose} />
      </TaskProvider>
    </ChakraProvider>
  );
};

export default Root;
