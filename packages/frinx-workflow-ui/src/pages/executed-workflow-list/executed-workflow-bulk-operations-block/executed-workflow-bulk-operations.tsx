import React, { FC } from 'react';

import {
  Button,
  Card,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

type Props = {
  isExecutingBulkOperation: boolean;
  amountOfVisibleWorkflows: number;
  amountOfSelectedWorkflows: number;
  onRestart: () => void;
  onRetry: () => void;
  onResume: () => void;
  onTerminate: () => void;
  onPause: () => void;
};

const ExecutedWorkflowBulkOperationsBlock: FC<Props> = ({
  isExecutingBulkOperation,
  amountOfVisibleWorkflows,
  amountOfSelectedWorkflows,
  onPause,
  onRestart,
  onResume,
  onRetry,
  onTerminate,
}) => {
  if (amountOfSelectedWorkflows === 0) {
    return (
      <Card p={15}>
        <Heading size="lg">Showing {amountOfVisibleWorkflows} workflows</Heading>
      </Card>
    );
  } else {
    return (
      <Card p={15} bgColor="blue.200">
        <HStack>
          <Heading size="lg" textColor="white">
            Selected {amountOfSelectedWorkflows} workflows
          </Heading>

          <Spacer />
        </HStack>
      </Card>
    );
  }
};

export default ExecutedWorkflowBulkOperationsBlock;
