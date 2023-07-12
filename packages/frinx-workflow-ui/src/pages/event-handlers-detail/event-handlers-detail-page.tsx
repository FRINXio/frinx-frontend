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
} from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor, unwrap, useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import {
  DeleteEventHandlerDetailMutation,
  DeleteEventHandlerDetailMutationVariables,
  EditEventHandlerActionsMutation,
  EditEventHandlerActionsMutationVariables,
  EventHandlerQuery,
  EventHandlerQueryVariables,
} from '../../__generated__/graphql';
import EventHandlersDetailActions from './event-handlers-detail-actions';
import { removeTypenamesFromEventHandlerAction } from '../../helpers/event-handlers.helpers';

type Props = {
  onEventHandlerEditClick: (event: string, name: string) => void;
};

const EVENT_HANDLER_QUERY = gql`
  query EventHandler($event: String!, $name: String!) {
    eventHandler(event: $event, name: $name) {
      id
      name
      event
      actions {
        id
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
`;

const DELETE_EVENT_HANDLER_MUTATION = gql`
  mutation DeleteEventHandlerDetail($deleteEventHandlerId: String!) {
    deleteEventHandler(id: $deleteEventHandlerId) {
      isOk
    }
  }
`;

const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation EditEventHandlerActions($input: UpdateEventHandlerInput!, $name: String!, $event: String!) {
    updateEventHandler(input: $input, name: $name, event: $event) {
      id
      name
      event
    }
  }
`;

const EventHandlersDetailPage: VoidFunctionComponent<Props> = ({ onEventHandlerEditClick }) => {
  const ctx = useMemo(() => ({ additionalTypenames: ['EventHandler'] }), []);
  const { event, name } = useParams<{ event: string; name: string }>();
  const navigate = useNavigate();
  const { addToastNotification } = useNotifications();
  const [{ data, fetching, error }] = useQuery<EventHandlerQuery, EventHandlerQueryVariables>({
    query: EVENT_HANDLER_QUERY,
    variables: {
      event: unwrap(event),
      name: unwrap(name),
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

  const handleOnEventHandlerDelete = (id: string) => {
    deleteEventHandler({
      deleteEventHandlerId: id,
    })
      .then((response) => {
        if (response.error != null) {
          throw new Error(response.error.message);
        }

        navigate('/event-handlers');
        addToastNotification({
          content: 'Successfully deleted event handler',
          type: 'success',
        });
      })
      .catch((err) => {
        addToastNotification({
          content: err.message,
          type: 'error',
        });
      });
  };

  const handleOnEventHandlerActionTaskEdit = (
    eventHandlerEvent: string,
    eventHandlerName: string,
    actionIndex: number,
    taskType: 'complete' | 'fail' | 'start',
  ) => {
    navigate(`../${eventHandlerEvent}/${eventHandlerName}/edit?taskType=${taskType}&actionIndex=${actionIndex}#action`);
  };

  const handleOnEventHandlerActionEdit = (eventHandlerEvent: string, eventHandlerName: string, actionIndex: number) => {
    navigate(`../${eventHandlerEvent}/${eventHandlerName}/edit?actionIndex=${actionIndex}#action`);
  };

  const handleOnEventHandlerActionDelete = (
    eventHandler: NonNullable<EventHandlerQuery['eventHandler']>,
    actionIndex: number,
  ) => {
    const newActions = [...eventHandler.actions.slice(0, actionIndex), ...eventHandler.actions.slice(actionIndex + 1)];
    updateEventHandler(
      {
        input: {
          actions: newActions.map(removeTypenamesFromEventHandlerAction),
        },
        event: eventHandler.event,
        name: eventHandler.name,
      },
      ctx,
    );
  };

  const handleOnEventHandlerActionTaskDelete = (
    eventHandler: NonNullable<EventHandlerQuery['eventHandler']>,
    actionIndex: number,
    taskType: 'complete' | 'fail' | 'start',
  ) => {
    let newAction = eventHandler.actions[actionIndex];

    if (taskType === 'complete') {
      newAction = {
        ...newAction,
        completeTask: null,
      };
    }

    if (taskType === 'fail') {
      newAction = {
        ...newAction,
        failTask: null,
      };
    }

    if (taskType === 'start') {
      newAction = {
        ...newAction,
        startWorkflow: null,
      };
    }

    updateEventHandler(
      {
        input: {
          actions: [
            ...eventHandler.actions.slice(0, actionIndex).map(removeTypenamesFromEventHandlerAction),
            removeTypenamesFromEventHandlerAction(newAction),
            ...eventHandler.actions.slice(actionIndex + 1).map(removeTypenamesFromEventHandlerAction),
          ],
        },
        event: eventHandler.event,
        name: eventHandler.name,
      },
      ctx,
    );
  };

  if (fetching) {
    return <Progress isIndeterminate size="xs" mt={-10} />;
  }

  if (data == null || data.eventHandler == null || error != null) {
    return (
      <Container maxWidth={1200} mx="auto">
        <Text>We could not find expected event handler. Try again later please.</Text>
      </Container>
    );
  }

  const { eventHandler } = data;
  const editorComment =
    selectedConditionLang === 'python' ? '# condition was not defined' : '// condition was not defined';

  return (
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
            onClick={() => onEventHandlerEditClick(eventHandler.event, eventHandler.name)}
          />
          <IconButton
            aria-label="delete event handler"
            icon={<FeatherIcon icon="trash-2" size={20} />}
            colorScheme="red"
            onClick={() => handleOnEventHandlerDelete(eventHandler.id)}
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
            readOnly
            value={eventHandler.condition ?? editorComment}
            height="400px"
            width="100%"
            theme="tomorrow"
            mode={selectedConditionLang || 'javascript'}
          />
          <FormHelperText>
            Currently supporting only JavaScript and Python{' '}
            <strong>(return value of function must be true or false)</strong>
          </FormHelperText>
        </FormControl>
      </Card>

      <EventHandlersDetailActions
        actions={eventHandler.actions}
        onEventHandlerActionTaskAdd={(actionIndex, taskType) => {
          handleOnEventHandlerActionTaskEdit(eventHandler.event, eventHandler.name, actionIndex, taskType);
        }}
        onEventHandlerActionTaskDelete={(actionIndex, taskType) => {
          handleOnEventHandlerActionTaskDelete(eventHandler, actionIndex, taskType);
        }}
        onEventHandlerActionDelete={(actionIndex) => {
          handleOnEventHandlerActionDelete(eventHandler, actionIndex);
        }}
        onEventHandlerActionEdit={(actionIndex) => {
          handleOnEventHandlerActionEdit(eventHandler.event, eventHandler.name, actionIndex);
        }}
      />
    </Container>
  );
};

export default EventHandlersDetailPage;
