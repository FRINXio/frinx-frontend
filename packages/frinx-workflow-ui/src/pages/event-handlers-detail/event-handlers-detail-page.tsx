import React, { ChangeEvent, useMemo, useState, VoidFunctionComponent } from 'react';
import {
  ButtonGroup,
  Card,
  Container,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  IconButton,
  Progress,
  Select,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDeleteModal, Editor, unwrap, useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import {
  DeleteEventHandlerDetailMutation,
  DeleteEventHandlerDetailMutationVariables,
  EditEventHandlerActionsMutation,
  EditEventHandlerActionsMutationVariables,
  EventHandlerDetailQuery,
  EventHandlerDetailQueryVariables,
} from '../../__generated__/graphql';
import EventHandlersDetailActions from './event-handlers-detail-actions';
import { removeTypenamesFromEventHandlerAction } from '../../helpers/event-handlers.helpers';

type Props = {
  onEventHandlerEditClick: (id: string) => void;
};

const EVENT_HANDLER_QUERY = gql`
  query EventHandlerDetail($id: ID!) {
    conductor {
      eventHandler(id: $id) {
        id
        name
        event
        actions {
          action
          expandInlineJSON
          completeTask {
            workflowId
            taskId
            output
            taskRefName
          }
          failTask {
            workflowId
            taskId
            output
            taskRefName
          }
          startWorkflow {
            name
            version
            input
            correlationId
            taskToDomain
          }
        }
        condition
        evaluatorType
        isActive
      }
    }
  }
`;

const DELETE_EVENT_HANDLER_MUTATION = gql`
  mutation DeleteEventHandlerDetail($deleteEventHandlerId: ID!) {
    conductor {
      deleteEventHandler(id: $deleteEventHandlerId)
    }
  }
`;

const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation EditEventHandlerActions($input: EditEventHandlerInput!) {
    conductor {
      editEventHandler(input: $input) {
        eventHandler {
          id
          name
          event
        }
      }
    }
  }
`;

const EventHandlersDetailPage: VoidFunctionComponent<Props> = ({ onEventHandlerEditClick }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ctx = useMemo(() => ({ additionalTypenames: ['EventHandler'] }), []);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToastNotification } = useNotifications();
  const [{ data, fetching, error }] = useQuery<EventHandlerDetailQuery, EventHandlerDetailQueryVariables>({
    query: EVENT_HANDLER_QUERY,
    variables: {
      id: unwrap(id),
    },
  });
  const [, deleteEventHandler] = useMutation<
    DeleteEventHandlerDetailMutation,
    DeleteEventHandlerDetailMutationVariables
  >(DELETE_EVENT_HANDLER_MUTATION);
  const [, updateEventHandler] = useMutation<EditEventHandlerActionsMutation, EditEventHandlerActionsMutationVariables>(
    UPDATE_EVENT_HANDLER_MUTATION,
  );
  const [selectedConditionLang, setSelectedConditionLang] = useState<'javascript' | 'python'>('javascript');

  const handleOnConditionLangSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'javascript') {
      setSelectedConditionLang('javascript');
      return;
    }

    setSelectedConditionLang('python');
  };

  const handleOnEventHandlerDelete = (eventHandlerId: string) => {
    deleteEventHandler(
      {
        deleteEventHandlerId: eventHandlerId,
      },
      {
        additionalTypenames: ['EventHandler'],
      },
    )
      .then((response) => {
        if (response.error != null) {
          throw new Error(response.error.message);
        }
        navigate('/workflow-manager/event-handlers');
      })
      .catch((err) => {
        addToastNotification({
          content: err.message,
          type: 'error',
        });
      });
  };

  const handleOnEventHandlerActionDelete = (
    eventHandler: NonNullable<EventHandlerDetailQuery['conductor']['eventHandler']>,
    actionIndex: number,
  ) => {
    updateEventHandler(
      {
        input: {
          id: eventHandler.id,
          actions: eventHandler.actions
            .filter((_, index) => index === actionIndex)
            .map(removeTypenamesFromEventHandlerAction),
        },
      },
      ctx,
    );
  };

  if (fetching) {
    return <Progress isIndeterminate size="xs" mt={-10} />;
  }

  if (data == null || data.conductor.eventHandler == null || error != null) {
    return (
      <Container maxWidth={1200} mx="auto">
        <Text>We could not find expected event handler. Try again later please.</Text>
      </Container>
    );
  }

  const { eventHandler } = data.conductor;
  const editorComment =
    selectedConditionLang === 'python' ? '# condition was not defined' : '// condition was not defined';

  return (
    <>
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        title="Are you sure you want to delete this event handler?"
        onConfirmBtnClick={() => {
          onClose();
          handleOnEventHandlerDelete(eventHandler.id);
        }}
      />
      <Container maxWidth={1200} mx="auto" mb={10}>
        <HStack alignItems="flex-start">
          <Heading mb={10}>
            Event handler: {eventHandler.name} ({eventHandler.isActive ? 'active' : 'not active'})
          </Heading>

          <Spacer />

          <ButtonGroup variant="solid">
            <IconButton
              aria-label="edit event handler"
              icon={<FeatherIcon icon="edit" size={20} />}
              onClick={() => onEventHandlerEditClick(eventHandler.id)}
            />
            <IconButton
              aria-label="delete event handler"
              icon={<FeatherIcon icon="trash-2" size={20} />}
              colorScheme="red"
              onClick={onOpen}
            />
          </ButtonGroup>
        </HStack>

        <Card borderRadius="md" p={10}>
          <Text>
            This event handler is executed on: <strong>{eventHandler.event}</strong>
          </Text>

          <Text>
            Evaluated by:{' '}
            <strong>{eventHandler.evaluatorType == null ? 'not defined' : eventHandler.evaluatorType}</strong>
          </Text>

          <FormControl>
            <HStack mb={5} alignItems="stretch">
              <Text>Condition when evaluated to true it will trigger</Text>

              <Spacer />

              <Select value={selectedConditionLang} onChange={handleOnConditionLangSelect} maxWidth="xs">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </Select>
            </HStack>
            <Editor
              value={eventHandler.condition ?? editorComment}
              height="400px"
              width="100%"
              language={selectedConditionLang || 'javascript'}
              options={{
                minimap: {
                  enabled: false,
                },
                autoIndent: 'full',
                readOnly: true,
              }}
            />
            <FormHelperText>
              Currently supporting only JavaScript and Python{' '}
              <strong>(return value of function must be true or false)</strong>
            </FormHelperText>
          </FormControl>
        </Card>

        <EventHandlersDetailActions
          actions={eventHandler.actions}
          onEventHandlerActionDelete={(actionIndex) => {
            handleOnEventHandlerActionDelete(eventHandler, actionIndex);
          }}
        />
      </Container>
    </>
  );
};

export default EventHandlersDetailPage;
