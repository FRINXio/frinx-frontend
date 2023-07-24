import React, { Fragment, useState, VoidFunctionComponent } from 'react';
import { Grid, Heading, HStack, IconButton, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { v4 as uuid } from 'uuid';
import { EventHandlerQuery } from '../../__generated__/graphql';
import EventHandlerDetailActionJsonModal from './event-handler-detail-action-json-modal';
import {
  CompleteTaskAction,
  FailTaskAction,
  StartWorkflowAction,
  UndefinedAction,
} from './event-handlers-detail-actions-tasks';

type Props = {
  actions: NonNullable<EventHandlerQuery['eventHandler']>['actions'];
  onEventHandlerActionTaskAdd: (actionIndex: number, taskType: 'complete' | 'fail' | 'start') => void;
  onEventHandlerActionTaskDelete: (actionIndex: number, taskType: 'complete' | 'fail' | 'start') => void;
  onEventHandlerActionEdit: (actionIndex: number) => void;
  onEventHandlerActionDelete: (actionIndex: number) => void;
};

const EventHandlersDetailActions: VoidFunctionComponent<Props> = ({
  onEventHandlerActionTaskDelete,
  onEventHandlerActionTaskAdd,
  onEventHandlerActionDelete,
  onEventHandlerActionEdit,
  actions,
}) => {
  const [json, setJson] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {json && <EventHandlerDetailActionJsonModal isOpen={isOpen} onClose={onClose} json={json} />}
      <Heading size="lg" mt={10} mb={5}>
        Event Handler Actions
      </Heading>
      {actions
        .map((action) => ({
          ...action,
          id: uuid(),
        }))
        .map((action, index) => {
          return (
            <Fragment key={action.id}>
              <HStack alignItems="stretch" mb={2}>
                <Text>Action {index}</Text>

                <Spacer />

                <IconButton
                  aria-label="Edit action"
                  icon={<FeatherIcon icon="edit" size={15} />}
                  size="xs"
                  onClick={() => {
                    onEventHandlerActionEdit(index);
                  }}
                />

                <IconButton
                  aria-label="Delete action"
                  icon={<FeatherIcon icon="trash-2" size={15} />}
                  size="xs"
                  colorScheme="red"
                  onClick={() => onEventHandlerActionDelete(index)}
                  disabled={actions.length === 1}
                  cursor={actions.length === 1 ? 'not-allowed' : 'pointer'}
                />
              </HStack>
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={6}
                mb={6}
                p={3}
                border="1px"
                borderRadius="md"
                borderStyle="solid"
                borderColor="gray.100"
              >
                <>
                  {action.startWorkflow != null ? (
                    <StartWorkflowAction
                      startWorkflow={action.startWorkflow}
                      onShowJsonModalClick={(jsonValue) => {
                        setJson(JSON.stringify(jsonValue, null, 2));
                        onOpen();
                      }}
                      onDeleteClick={() => onEventHandlerActionTaskDelete(index, 'start')}
                    />
                  ) : (
                    <UndefinedAction onUndefinedActionClick={() => onEventHandlerActionTaskAdd(index, 'start')}>
                      <Text>Start workflow was not defined</Text>
                    </UndefinedAction>
                  )}

                  {action.completeTask != null ? (
                    <CompleteTaskAction
                      completeTask={action.completeTask}
                      onShowJsonModalClick={(jsonValue) => {
                        setJson(JSON.stringify(jsonValue, null, 2));
                        onOpen();
                      }}
                      onDeleteClick={() => onEventHandlerActionTaskDelete(index, 'complete')}
                    />
                  ) : (
                    <UndefinedAction onUndefinedActionClick={() => onEventHandlerActionTaskAdd(index, 'complete')}>
                      <Text>Complete task was not defined</Text>
                    </UndefinedAction>
                  )}

                  {action.failTask != null ? (
                    <FailTaskAction
                      failTask={action.failTask}
                      onShowJsonModalClick={(jsonValue) => {
                        setJson(JSON.stringify(jsonValue, null, 2));
                        onOpen();
                      }}
                      onDeleteClick={() => onEventHandlerActionTaskDelete(index, 'fail')}
                    />
                  ) : (
                    <UndefinedAction onUndefinedActionClick={() => onEventHandlerActionTaskAdd(index, 'fail')}>
                      <Text>Fail task was not defined</Text>
                    </UndefinedAction>
                  )}
                </>
              </Grid>
            </Fragment>
          );
        })}
    </>
  );
};

export default EventHandlersDetailActions;
