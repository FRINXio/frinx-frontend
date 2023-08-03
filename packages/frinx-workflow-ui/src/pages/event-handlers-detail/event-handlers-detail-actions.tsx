import React, { Fragment, useState, VoidFunctionComponent } from 'react';
import { Heading, useDisclosure } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { ConfirmDeleteModal } from '@frinx/shared';
import { EventHandlerQuery } from '../../__generated__/graphql';
import EventHandlerDetailActionJsonModal from './event-handler-detail-action-json-modal';
import { CompleteTaskAction, FailTaskAction, StartWorkflowAction } from './event-handlers-detail-actions-tasks';

type Props = {
  actions: NonNullable<EventHandlerQuery['eventHandler']>['actions'];
  onEventHandlerActionDelete: (actionIndex: number) => void;
};

const EventHandlersDetailActions: VoidFunctionComponent<Props> = ({ onEventHandlerActionDelete, actions }) => {
  const { isOpen: isAlertOpened, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
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
              <ConfirmDeleteModal
                isOpen={isAlertOpened}
                onClose={onAlertClose}
                title="Are you sure you want to delete whole action?"
                onConfirmBtnClick={() => {
                  onAlertClose();
                  onEventHandlerActionDelete(index);
                }}
              />
              {action.action === 'start_workflow' && (
                <StartWorkflowAction
                  startWorkflow={action.startWorkflow}
                  onShowJsonModalClick={(jsonValue) => {
                    setJson(JSON.stringify(jsonValue, null, 2));
                    onOpen();
                  }}
                  onDeleteClick={onAlertOpen}
                  cannotBeDeleted={actions.length === 1}
                />
              )}

              {action.action === 'complete_task' && (
                <CompleteTaskAction
                  completeTask={action.completeTask}
                  onShowJsonModalClick={(jsonValue) => {
                    setJson(JSON.stringify(jsonValue, null, 2));
                    onOpen();
                  }}
                  onDeleteClick={onAlertOpen}
                  cannotBeDeleted={actions.length === 1}
                />
              )}

              {action.action === 'fail_task' && (
                <FailTaskAction
                  failTask={action.failTask}
                  onShowJsonModalClick={(jsonValue) => {
                    setJson(JSON.stringify(jsonValue, null, 2));
                    onOpen();
                  }}
                  onDeleteClick={onAlertOpen}
                  cannotBeDeleted={actions.length === 1}
                />
              )}
            </Fragment>
          );
        })}
    </>
  );
};

export default EventHandlersDetailActions;
