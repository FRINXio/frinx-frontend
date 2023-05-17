import { UseDisclosureReturn } from '@chakra-ui/react';
import {
  useNotifications,
  callbackUtils,
  ExecuteWorkflowModal,
  ClientWorkflow,
  CreateScheduledWorkflow,
  unwrap,
} from '@frinx/shared/src';
import { gql, useMutation } from 'urql';

import React, { VoidFunctionComponent } from 'react';
import {
  DefinitionModal,
  DiagramModal,
  DependencyModal,
  ScheduleWorkflowModal,
  ConfirmDeleteModal,
} from '../../../common/modals';
import { ScheduleWorkflowMutation, ScheduleWorkflowMutationVariables } from '../../../__generated__/graphql';

type Props = {
  workflows: ClientWorkflow[];
  activeWorkflow?: ClientWorkflow;
  definitionModal: UseDisclosureReturn;
  diagramModal: UseDisclosureReturn;
  dependencyModal: UseDisclosureReturn;
  executeWorkflowModal: UseDisclosureReturn;
  scheduledWorkflowModal: UseDisclosureReturn;
  confirmDeleteModal: UseDisclosureReturn;
  onDeleteWorkflow: (workflow: ClientWorkflow) => Promise<void>;
};

const CREATE_SCHEDULE_MUTATION = gql`
  mutation ScheduleWorkflow($input: CreateScheduleInput!) {
    scheduleWorkflow(input: $input) {
      name
      isEnabled
      workflowName
      workflowVersion
      cronString
      workflowContext
      performFromDate
      performTillDate
    }
  }
`;

const WorkflowDefinitionsModals: VoidFunctionComponent<Props> = ({
  workflows,
  activeWorkflow,
  confirmDeleteModal,
  definitionModal,
  dependencyModal,
  diagramModal,
  executeWorkflowModal,
  scheduledWorkflowModal,
  onDeleteWorkflow,
}) => {
  const [, onCreate] = useMutation<ScheduleWorkflowMutation, ScheduleWorkflowMutationVariables>(
    CREATE_SCHEDULE_MUTATION,
  );

  const { addToastNotification } = useNotifications();

  const handleWorkflowSchedule = (scheduledWf: CreateScheduledWorkflow) => {
    const scheduleInput = {
      ...scheduledWf,
      cronString: unwrap(scheduledWf.cronString),
      workflowContext: JSON.stringify(scheduledWf.workflowContext),
    };

    if (scheduledWf.workflowName != null && scheduledWf.workflowVersion != null) {
      onCreate({ input: scheduleInput })
        .then((res) => {
          if (!res.data?.scheduleWorkflow) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.scheduleWorkflow || !res.error) {
            addToastNotification({
              content: 'Successfully scheduled',
              title: 'Success',
              type: 'success',
            });
          }
        })
        .catch(() => {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: 'Failed to schedule workflow',
          });
        });
    }
  };

  const handleOnDeleteWorkflowClick = async () => {
    if (activeWorkflow != null) {
      try {
        await onDeleteWorkflow(activeWorkflow);
        addToastNotification({
          type: 'success',
          title: 'Success',
          content: 'Successfully deleted workflow',
        });
      } catch (e) {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Failed to delete workflow',
        });
      }
    }

    confirmDeleteModal.onClose();
  };

  const handleOnExecuteWorkflow = (values: Record<string, unknown>) => {
    if (activeWorkflow == null) {
      addToastNotification({
        content: 'We cannot execute undefined workflow',
        type: 'error',
      });

      return null;
    }

    const { executeWorkflow } = callbackUtils.getCallbacks;

    return executeWorkflow({
      input: Object.keys(values).reduce((acc: Record<string, string>, key) => {
        const value = values[key];
        if (value != null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {}),
      name: activeWorkflow.name,
      version: activeWorkflow.version || 1,
    })
      .then((res) => {
        addToastNotification({ content: 'We successfully executed workflow', type: 'success' });
        return res.text;
      })
      .catch(() => {
        addToastNotification({ content: 'We have a problem to execute selected workflow', type: 'error' });
        return null;
      });
  };

  if (activeWorkflow == null) {
    return null;
  }

  return (
    <>
      <DefinitionModal workflow={activeWorkflow} isOpen={definitionModal.isOpen} onClose={definitionModal.onClose} />
      <DiagramModal workflow={activeWorkflow} isOpen={diagramModal.isOpen} onClose={diagramModal.onClose} />
      <DependencyModal
        workflow={activeWorkflow}
        onClose={dependencyModal.onClose}
        isOpen={dependencyModal.isOpen}
        workflows={workflows}
      />
      <ScheduleWorkflowModal
        workflow={activeWorkflow}
        onClose={scheduledWorkflowModal.onClose}
        isOpen={scheduledWorkflowModal.isOpen}
        onSubmit={handleWorkflowSchedule}
      />
      <ExecuteWorkflowModal
        workflow={activeWorkflow}
        onClose={executeWorkflowModal.onClose}
        isOpen={executeWorkflowModal.isOpen}
        onSubmit={handleOnExecuteWorkflow}
      />
      <ConfirmDeleteModal
        activeWorkflow={activeWorkflow}
        isOpen={confirmDeleteModal.isOpen}
        onClose={confirmDeleteModal.onClose}
        onDelete={handleOnDeleteWorkflowClick}
      />
    </>
  );
};

export default WorkflowDefinitionsModals;
