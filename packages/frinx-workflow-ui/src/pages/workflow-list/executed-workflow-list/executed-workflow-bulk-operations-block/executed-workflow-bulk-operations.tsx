import React, { FC, useState } from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Progress,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import callbackUtils from '../../../../utils/callback-utils';
import useNotifications from '../../../../hooks/use-notifications';

type CallBackUtilsFunctionNames =
  | 'restartWorkflowsCallback'
  | 'resumeWorkflowsCallback'
  | 'pauseWorkflowsCallback'
  | 'deleteWorkflowInstanceCallback'
  | 'terminateWorkflowsCallback';

type Props = {
  workflowsAmount: number;
  selectedWorkflows: string[];
  selectAllWorkflows: (isChecked: boolean) => void;
};

const ExecutedWorkflowBulkOperationsBlock: FC<Props> = ({ workflowsAmount, selectedWorkflows, selectAllWorkflows }) => {
  const [isFetching, setIsFetching] = useState(false);
  const { addToastNotification } = useNotifications();

  const executeBulkOperation = (operationFunctionName: CallBackUtilsFunctionNames) => {
    if (selectedWorkflows.length === 0) return;

    setIsFetching(true);

    if (operationFunctionName === 'deleteWorkflowInstanceCallback') {
      const operation = callbackUtils[operationFunctionName]();
      Promise.all(selectedWorkflows.map(async (workflow) => await operation(workflow)))
        .then(() =>
          addToastNotification({ content: 'Successfully executed bulk operation', type: 'success', title: 'Success' }),
        )
        .catch((err) => addToastNotification({ content: err.message, type: 'error', title: 'Error' }))
        .finally(() => {
          setIsFetching(false);
          selectAllWorkflows(false);
        });
    } else {
      const operation = callbackUtils[operationFunctionName]();
      operation(selectedWorkflows)
        .then(() =>
          addToastNotification({ content: 'Successfully executed bulk operation', type: 'success', title: 'Success' }),
        )
        .catch((err) => addToastNotification({ content: err.message, type: 'error', title: 'Error' }))
        .finally(() => {
          setIsFetching(false);
          selectAllWorkflows(false);
        });
    }
  };

  return (
    <Accordion allowToggle marginBottom={4} backgroundColor="white">
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Bulk Processing (click to expand)&nbsp;&nbsp;
              <Icon as={FontAwesomeIcon} icon={faEllipsisH} />
              &nbsp;&nbsp; Displaying <b>{workflowsAmount}</b> workflows
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel padding={8}>
          <Flex justifyContent="space-between">
            <Box>
              <Heading as="h5" size="sm">
                Workflows selected: {selectedWorkflows.length}
                {isFetching ? (
                  <Spinner color="brand.500" size="md" marginLeft={8} float="right" marginRight={40} />
                ) : null}
              </Heading>
            </Box>
            <Stack spacing={4} direction="row">
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => executeBulkOperation('pauseWorkflowsCallback')}
              >
                Pause
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => executeBulkOperation('resumeWorkflowsCallback')}
              >
                Resume
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => executeBulkOperation('restartWorkflowsCallback')}
              >
                Restart
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => executeBulkOperation('terminateWorkflowsCallback')}
              >
                Terminate
              </Button>
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => executeBulkOperation('deleteWorkflowInstanceCallback')}
              >
                Delete
              </Button>
            </Stack>
          </Flex>
        </AccordionPanel>
        <Progress marginTop={5} max={100} size="xs" />
      </AccordionItem>
    </Accordion>
  );
};

export default ExecutedWorkflowBulkOperationsBlock;
