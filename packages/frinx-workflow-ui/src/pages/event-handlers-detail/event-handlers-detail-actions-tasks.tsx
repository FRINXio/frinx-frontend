import React, { VoidFunctionComponent } from 'react';
import { Button, Card, Heading, HStack, IconButton, Spacer, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { EventHandlerAction } from '../../__generated__/graphql';

type StartWorkflowActionProps = {
  startWorkflow: EventHandlerAction['startWorkflow'];
  onShowJsonModalClick: (json: string) => void;
  onDeleteClick: () => void;
  cannotBeDeleted: boolean;
};

type CompleteTaskActionProps = {
  completeTask: EventHandlerAction['completeTask'];
  onShowJsonModalClick: (json: string) => void;
  onDeleteClick: () => void;
  cannotBeDeleted: boolean;
};

type FailTaskActionProps = {
  failTask: EventHandlerAction['failTask'];
  onShowJsonModalClick: (json: string) => void;
  onDeleteClick: () => void;
  cannotBeDeleted: boolean;
};

const StartWorkflowAction: VoidFunctionComponent<StartWorkflowActionProps> = ({
  startWorkflow,
  onShowJsonModalClick,
  onDeleteClick,
  cannotBeDeleted,
}) => {
  return (
    <Card p={10} mb={5}>
      <HStack alignItems="stretch">
        <Heading size="md" mb={5}>
          Start workflow
        </Heading>

        <Spacer />

        <IconButton
          aria-label="delete event handler action start workflow"
          icon={<FeatherIcon icon="trash-2" size={15} />}
          size="xs"
          colorScheme="red"
          onClick={onDeleteClick}
          isDisabled={cannotBeDeleted}
          title={cannotBeDeleted ? 'Cannot delete this action. At least one must be defined' : undefined}
        />
      </HStack>

      <Text>
        Workflow name:{' '}
        <Text as="i" textColor="gray.300">
          {startWorkflow?.name ?? 'not defined'}
        </Text>
      </Text>
      <Text>
        Workflow version:{' '}
        <Text as="i" textColor="gray.300">
          {startWorkflow?.version ?? '-'}
        </Text>
      </Text>
      <Text>
        Workflow input:{' '}
        <Button onClick={() => onShowJsonModalClick(startWorkflow?.input ?? '')} size="xs">
          Show me input
        </Button>
      </Text>
      <Text>
        Workflow correlation id:{' '}
        <Text as="i" textColor="gray.300">
          {startWorkflow?.correlationId ?? 'not defined'}
        </Text>
      </Text>
      <Text>
        Workflow task to domain:{' '}
        <Button onClick={() => onShowJsonModalClick(startWorkflow?.taskToDomain ?? '')} size="xs">
          Show me task to domain
        </Button>
      </Text>
    </Card>
  );
};

const CompleteTaskAction: VoidFunctionComponent<CompleteTaskActionProps> = ({
  completeTask,
  onShowJsonModalClick,
  onDeleteClick,
  cannotBeDeleted,
}) => {
  return (
    <Card p={10} mb={5}>
      <HStack alignItems="stretch">
        <Heading size="md" mb={5}>
          Complete task
        </Heading>

        <Spacer />

        <IconButton
          aria-label="delete event handler action start workflow"
          icon={<FeatherIcon icon="trash-2" size={15} />}
          size="xs"
          colorScheme="red"
          onClick={onDeleteClick}
          isDisabled={cannotBeDeleted}
          title={cannotBeDeleted ? 'Cannot delete this action. At least one must be defined' : undefined}
        />
      </HStack>

      <Text>
        Workflow id:{' '}
        <Text as="i" textColor="gray.300">
          {completeTask?.workflowId ?? 'not defined'}
        </Text>
      </Text>
      <Text>
        Task id:{' '}
        <Text as="i" textColor="gray.300">
          {completeTask?.taskId ?? 'not defined'}
        </Text>
      </Text>
      <Text>
        Task output:{' '}
        <Button onClick={() => onShowJsonModalClick(completeTask?.output ?? '')} size="xs">
          Show me output
        </Button>
      </Text>
      <Text>
        Task ref name:{' '}
        <Text as="i" textColor="gray.300">
          {completeTask?.taskRefName ?? '-'}
        </Text>
      </Text>
    </Card>
  );
};

const FailTaskAction: VoidFunctionComponent<FailTaskActionProps> = ({
  failTask,
  onShowJsonModalClick,
  onDeleteClick,
  cannotBeDeleted,
}) => {
  return (
    <Card p={10} mb={5}>
      <HStack alignItems="stretch">
        <Heading size="md" mb={5}>
          Fail task
        </Heading>

        <Spacer />

        <IconButton
          aria-label="delete event handler action start workflow"
          icon={<FeatherIcon icon="trash-2" size={15} />}
          size="xs"
          colorScheme="red"
          onClick={onDeleteClick}
          isDisabled={cannotBeDeleted}
          title={cannotBeDeleted ? 'Cannot delete this action. At least one must be defined' : undefined}
        />
      </HStack>

      <Text>
        Workflow id:{' '}
        <Text as="i" textColor="gray.300">
          {failTask?.workflowId ?? 'not defined'}
        </Text>
      </Text>
      <Text>
        Task id:{' '}
        <Text as="i" textColor="gray.300">
          {failTask?.taskId ?? 'not defined'}
        </Text>
      </Text>
      <Text>
        Task ref name:{' '}
        <Text as="i" textColor="gray.300">
          {failTask?.taskRefName ?? '-'}
        </Text>
      </Text>
      <Text>
        Task output:{' '}
        <Button onClick={() => onShowJsonModalClick(failTask?.output ?? '')} size="xs">
          Show me output
        </Button>
      </Text>
    </Card>
  );
};

export { StartWorkflowAction, CompleteTaskAction, FailTaskAction };
