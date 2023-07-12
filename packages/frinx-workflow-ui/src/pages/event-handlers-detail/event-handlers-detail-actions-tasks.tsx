import React, { FC, VoidFunctionComponent } from 'react';
import { Button, Card, Center, GridItem, Heading, HStack, IconButton, Spacer, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { EventHandlerQuery } from '../../__generated__/graphql';

type StartWorkflowActionProps = {
  startWorkflow: NonNullable<EventHandlerQuery['eventHandler']>['actions']['0']['startWorkflow'];
  onShowJsonModalClick: (json: string) => void;
  onDeleteClick: () => void;
};

type CompleteTaskActionProps = {
  completeTask: NonNullable<EventHandlerQuery['eventHandler']>['actions']['0']['completeTask'];
  onShowJsonModalClick: (json: string) => void;
  onDeleteClick: () => void;
};

type FailTaskActionProps = {
  failTask: NonNullable<EventHandlerQuery['eventHandler']>['actions']['0']['failTask'];
  onShowJsonModalClick: (json: string) => void;
  onDeleteClick: () => void;
};

const UndefinedAction: FC<{ onUndefinedActionClick: () => void }> = ({ children, onUndefinedActionClick }) => {
  return (
    <GridItem
      as={Center}
      border="1px"
      borderStyle="dashed"
      borderColor="gray.300"
      width="100%"
      height="100%"
      cursor="pointer"
      borderRadius="md"
      _hover={{
        borderColor: 'gray.500',
        bgColor: 'gray.100',
        transition: '0.2s ease-in-out',
      }}
      onClick={onUndefinedActionClick}
      title="Click to add action"
    >
      {children}
    </GridItem>
  );
};

const StartWorkflowAction: VoidFunctionComponent<StartWorkflowActionProps> = ({
  startWorkflow,
  onShowJsonModalClick,
  onDeleteClick,
}) => {
  return (
    <GridItem as={Card} borderRadius="md" p={10}>
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
    </GridItem>
  );
};

const CompleteTaskAction: VoidFunctionComponent<CompleteTaskActionProps> = ({
  completeTask,
  onShowJsonModalClick,
  onDeleteClick,
}) => {
  return (
    <GridItem as={Card} borderRadius="md" p={10}>
      <HStack alignItems="stretch">
        <Heading size="md" mb={5}>
          Complete task
        </Heading>

        <Spacer />

        <IconButton
          aria-label="delete event handler action complete task"
          icon={<FeatherIcon icon="trash-2" size={15} />}
          size="xs"
          colorScheme="red"
          onClick={onDeleteClick}
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
    </GridItem>
  );
};

const FailTaskAction: VoidFunctionComponent<FailTaskActionProps> = ({
  failTask,
  onShowJsonModalClick,
  onDeleteClick,
}) => {
  return (
    <GridItem as={Card} borderRadius="md" p={10}>
      <HStack alignItems="stretch">
        <Heading size="md" mb={5}>
          Fail task
        </Heading>

        <Spacer />

        <IconButton
          aria-label="delete event handler action fail task"
          icon={<FeatherIcon icon="trash-2" size={15} />}
          size="xs"
          colorScheme="red"
          onClick={onDeleteClick}
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
    </GridItem>
  );
};

export { UndefinedAction, StartWorkflowAction, CompleteTaskAction, FailTaskAction };
