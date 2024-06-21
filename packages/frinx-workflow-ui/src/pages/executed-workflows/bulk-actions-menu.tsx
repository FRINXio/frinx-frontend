import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Spinner, Text } from '@chakra-ui/react';
import React, { FC, useMemo } from 'react';
import { gql, useMutation } from 'urql';
import {
  BulkPauseWorkflowMutation,
  BulkPauseWorkflowMutationVariables,
  BulkRestartWorkflowMutation,
  BulkRestartWorkflowMutationVariables,
  BulkResumeWorkflowMutation,
  BulkResumeWorkflowMutationVariables,
  BulkRetryWorkflowMutation,
  BulkRetryWorkflowMutationVariables,
  BulkTerminateWorkflowMutation,
  BulkTerminateWorkflowMutationVariables,
} from '../../__generated__/graphql';

const BULK_PAUSE_MUTATION = gql`
  mutation BulkPauseWorkflow($input: [String]) {
    conductor {
      pauseWorkflow_1(input: $input) {
        bulkErrorResults
        bulkSuccessfulResults
      }
    }
  }
`;
const BULK_RETRY_MUTATION = gql`
  mutation BulkRetryWorkflow($input: [String]) {
    conductor {
      retry_1(input: $input) {
        bulkErrorResults
        bulkSuccessfulResults
      }
    }
  }
`;
const BULK_RESUME_MUTATION = gql`
  mutation BulkResumeWorkflow($input: [String]) {
    conductor {
      resumeWorkflow_1(input: $input) {
        bulkErrorResults
        bulkSuccessfulResults
      }
    }
  }
`;
const BULK_TERMINATE_MUTATION = gql`
  mutation BulkTerminateWorkflow($input: [String]) {
    conductor {
      terminate(input: $input) {
        bulkErrorResults
        bulkSuccessfulResults
      }
    }
  }
`;
const BULK_RESTART_MUTATION = gql`
  mutation BulkRestartWorkflow($input: [String]) {
    conductor {
      restart_1(input: $input) {
        bulkErrorResults
        bulkSuccessfulResults
      }
    }
  }
`;

function formatWorkflowsNumberString(workflowCount: number): string {
  if (workflowCount === 1) {
    return '1 workflow selected';
  }
  return `${workflowCount} workflows selected`;
}

type Props = {
  selectedWorkflowIds: string[];
  onBulkActionSuccess: (message?: string) => void;
  onBulkActionError: (message?: string) => void;
};

const BulkActionsMenu: FC<Props> = ({ selectedWorkflowIds, onBulkActionSuccess, onBulkActionError }) => {
  const ctx = useMemo(
    () => ({ additionalTypenames: ['ExecutedWorkflows', 'ExecutedWorkflowConnection', 'ExecutedWorkflowEdge'] }),
    [],
  );
  const [{ fetching: isPauseFetching }, bulkPauseWorkflows] = useMutation<
    BulkPauseWorkflowMutation,
    BulkPauseWorkflowMutationVariables
  >(BULK_PAUSE_MUTATION);
  const [{ fetching: isRetryFetching }, bulkRetryWorkflows] = useMutation<
    BulkRetryWorkflowMutation,
    BulkRetryWorkflowMutationVariables
  >(BULK_RETRY_MUTATION);
  const [{ fetching: isResumeFetching }, bulkResumeWorkflows] = useMutation<
    BulkResumeWorkflowMutation,
    BulkResumeWorkflowMutationVariables
  >(BULK_RESUME_MUTATION);
  const [{ fetching: isTerminateFetching }, bulkTermiateWorkflows] = useMutation<
    BulkTerminateWorkflowMutation,
    BulkTerminateWorkflowMutationVariables
  >(BULK_TERMINATE_MUTATION);
  const [{ fetching: isRestartFetching }, bulkRestartWorkflows] = useMutation<
    BulkRestartWorkflowMutation,
    BulkRestartWorkflowMutationVariables
  >(BULK_RESTART_MUTATION);

  const isFetching = isPauseFetching || isRetryFetching || isResumeFetching || isTerminateFetching || isRestartFetching;

  const handleBulkPauseButtonClick = () => {
    bulkPauseWorkflows({ input: selectedWorkflowIds }, ctx).then((res) => {
      const hasPauseErrors = Object.keys(res.data?.conductor.pauseWorkflow_1?.bulkErrorResults).length > 0;
      if (hasPauseErrors) {
        return onBulkActionError("One or more workflow can't be paused.");
      }
      return onBulkActionSuccess();
    });
  };

  const handleBulkRetryButtonClick = () => {
    bulkRetryWorkflows({ input: selectedWorkflowIds }, ctx).then((res) => {
      if (res.data?.conductor.retry_1?.bulkSuccessfulResults?.length) {
        return onBulkActionSuccess();
      }
      return onBulkActionError("One or more workflow can't be retried.");
    });
  };

  const handleBulkResumeButtonClick = () => {
    bulkResumeWorkflows({ input: selectedWorkflowIds }, ctx).then((res) => {
      if (res.data?.conductor.resumeWorkflow_1?.bulkSuccessfulResults?.length) {
        return onBulkActionSuccess();
      }
      return onBulkActionError("One or more workflow can't be resumed.");
    });
  };

  const handleBulkTerminateButtonClick = () => {
    bulkTermiateWorkflows({ input: selectedWorkflowIds }, ctx).then((res) => {
      if (res.data?.conductor.terminate?.bulkSuccessfulResults?.length) {
        return onBulkActionSuccess();
      }
      return onBulkActionError("One or more workflow can't be terminated.");
    });
  };

  const handleBulkRestartButtonClick = () => {
    bulkRestartWorkflows({ input: selectedWorkflowIds }, ctx).then((res) => {
      if (res.data?.conductor.restart_1?.bulkSuccessfulResults?.length) {
        return onBulkActionSuccess();
      }
      return onBulkActionError("One or more workflows can't be restarted.");
    });
  };

  return (
    <Menu size="sm">
      <MenuButton
        isDisabled={isFetching || selectedWorkflowIds.length === 0}
        size="sm"
        as={Button}
        colorScheme="gray"
        rightIcon={<ChevronDownIcon />}
        position="relative"
      >
        <Text opacity={isFetching ? 0 : 1} as="span">
          {selectedWorkflowIds.length === 0 ? 'Bulk actions' : formatWorkflowsNumberString(selectedWorkflowIds.length)}
        </Text>
        {isFetching && (
          <Box position="relative" top="50%" left="50%" transform="translate(-50%, -50%)">
            <Spinner size="sm" />
          </Box>
        )}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleBulkPauseButtonClick}>Pause workflows</MenuItem>
        <MenuItem onClick={handleBulkRetryButtonClick}>Retry workflows</MenuItem>
        <MenuItem onClick={handleBulkResumeButtonClick}>Resume workflows</MenuItem>
        <MenuItem onClick={handleBulkTerminateButtonClick}>Terminate workflows</MenuItem>
        <MenuItem onClick={handleBulkRestartButtonClick}>Restart workflows</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default BulkActionsMenu;
