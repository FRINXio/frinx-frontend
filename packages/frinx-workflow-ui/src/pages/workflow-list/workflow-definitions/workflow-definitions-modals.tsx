import { UseDisclosureReturn } from '@chakra-ui/react';
import {
  useNotifications,
  callbackUtils,
  ScheduledWorkflow,
  ExecuteWorkflowModal,
  ClientWorkflow,
} from '@frinx/shared/src';
import React, { VoidFunctionComponent } from 'react';
import { gql, useMutation } from 'urql';
import {
  DefinitionModal,
  DiagramModal,
  DependencyModal,
  ScheduledWorkflowModal,
  ConfirmDeleteModal,
} from '../../../common/modals';
import {
  ExecuteWorkflowDefinitionMutation,
  ExecuteWorkflowDefinitionMutationVariables,
} from '../../../__generated__/graphql';

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowDefinition($input: ExecuteWorkflowByName!) {
    executeWorkflowByName(input: $input)
  }
`;

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
  const { addToastNotification } = useNotifications();
  const [, executeWorkflow] = useMutation<
    ExecuteWorkflowDefinitionMutation,
    ExecuteWorkflowDefinitionMutationVariables
  >(EXECUTE_WORKFLOW_MUTATION);

  const handleWorkflowSchedule = (scheduledWf: Partial<ScheduledWorkflow>) => {
    const { registerSchedule } = callbackUtils.getCallbacks;
    if (scheduledWf.workflowName != null && scheduledWf.workflowVersion != null) {
      registerSchedule(scheduledWf.workflowName, scheduledWf.workflowVersion, {
        ...scheduledWf,
        workflowVersion: String(scheduledWf.workflowVersion),
      })
        .then(() => {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Successfully scheduled',
          });
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

  const handleOnExecuteWorkflow = (values: Record<string, string>): Promise<string | null> | null => {
    if (activeWorkflow == null) {
      addToastNotification({
        content: 'We cannot execute undefined workflow',
        type: 'error',
      });

      return null;
    }

    return executeWorkflow({
      input: {
        workflowName: activeWorkflow.name,
        workflowVersion: activeWorkflow.version,
        priority: 0,
        inputParameters: JSON.stringify(values),
      },
    })
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({ content: 'We successfully executed workflow', type: 'success' });
        return res.data?.executeWorkflowByName ?? null;
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
      <ScheduledWorkflowModal
        workflow={{
          workflowName: activeWorkflow.name,
          workflowVersion: String(activeWorkflow.version),
        }}
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
