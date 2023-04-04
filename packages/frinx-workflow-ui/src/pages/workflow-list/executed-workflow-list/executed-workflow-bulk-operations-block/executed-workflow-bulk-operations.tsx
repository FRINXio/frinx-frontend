import React, { FC, useState } from 'react';

import { Button, Card, HStack, Heading, Menu, MenuButton, MenuItem, MenuList, Spacer, Spinner } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNotifications, callbackUtils } from '@frinx/shared/src';

type CallBackUtilsFunctionNames =
  | 'restartWorkflows'
  | 'resumeWorkflows'
  | 'pauseWorkflows'
  | 'deleteWorkflowInstance'
  | 'terminateWorkflows';

type Props = {
  amountOfVisibleWorkflows: number;
  selectedWorkflows: string[];
  selectAllWorkflows: (isChecked: boolean) => void;
  onSuccessfullOperation: () => void;
};

const ExecutedWorkflowBulkOperationsBlock: FC<Props> = ({
  amountOfVisibleWorkflows,
  selectedWorkflows,
  selectAllWorkflows,
  onSuccessfullOperation,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const { addToastNotification } = useNotifications();

  const executeBulkOperation = (operationFunctionName: CallBackUtilsFunctionNames) => {
    if (selectedWorkflows.length === 0) return;

    setIsFetching(true);

    if (operationFunctionName === 'deleteWorkflowInstance') {
      const operations = callbackUtils.getCallbacks;
      Promise.all(selectedWorkflows.map((workflow) => operations[operationFunctionName](workflow)))
        .then(() => {
          addToastNotification({
            content: 'Successfully deleted executed workflows',
            type: 'success',
            title: 'Success',
          });
          onSuccessfullOperation();
        })
        .catch((err) => addToastNotification({ content: err.message, type: 'error', title: 'Error' }))
        .finally(() => {
          setIsFetching(false);
          selectAllWorkflows(false);
        });
    } else {
      const operations = callbackUtils.getCallbacks;
      operations[operationFunctionName](selectedWorkflows)
        .then(() => {
          addToastNotification({ content: 'Successfully executed bulk operation', type: 'success' });
          onSuccessfullOperation();
        })
        .catch((err) => addToastNotification({ content: err.message, type: 'error', title: 'Error' }))
        .finally(() => {
          setIsFetching(false);
          selectAllWorkflows(false);
        });
    }
  };

  if (selectedWorkflows.length === 0) {
    return (
      <Card>
        <Heading>Showing {amountOfVisibleWorkflows} workflows</Heading>
      </Card>
    );
  } else {
    return (
      <Card>
        <HStack>
          <Heading>Selected {selectedWorkflows.length} workflows</Heading>

          <Spacer />

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Bulk actions
            </MenuButton>
            <MenuList>
              <MenuItem>Restart with current definitions</MenuItem>
              <MenuItem>Restart with latest definitions</MenuItem>
              <MenuItem>Retry</MenuItem>
              <MenuItem>Resume</MenuItem>
              <MenuItem>Pause</MenuItem>
              <MenuItem>Terminate</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Card>
    );
  }
};

export default ExecutedWorkflowBulkOperationsBlock;
