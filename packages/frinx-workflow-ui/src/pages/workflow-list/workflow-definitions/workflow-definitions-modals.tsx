import { UseDisclosureReturn } from '@chakra-ui/react';
import { useNotifications, callbackUtils, ScheduledWorkflow, ExecuteWorkflowModal } from '@frinx/shared/src';
import React, { VoidFunctionComponent } from 'react';
import {
  DefinitionModal,
  DiagramModal,
  DependencyModal,
  ScheduledWorkflowModal,
  ConfirmDeleteModal,
} from '../../../common/modals';
import { Workflow } from './workflow-types';

type Props = {
  workflows: Workflow[];
  activeWorkflow?: Workflow;
  definitionModal: UseDisclosureReturn;
  diagramModal: UseDisclosureReturn;
  dependencyModal: UseDisclosureReturn;
  executeWorkflowModal: UseDisclosureReturn;
  scheduledWorkflowModal: UseDisclosureReturn;
  confirmDeleteModal: UseDisclosureReturn;
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
}) => {
  const { addToastNotification } = useNotifications();

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

  const handleOnDeleteWorkflowClick = () => {
    const { deleteWorkflow } = callbackUtils.getCallbacks;

    if (activeWorkflow != null) {
      deleteWorkflow(activeWorkflow.name, String(activeWorkflow.version))
        .then(() => {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Successfully deleted workflow',
          });
        })
        .catch(() => {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: 'Failed to delete workflow',
          });
        });
    } else {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to delete workflow',
      });
    }

    confirmDeleteModal.onClose();
  };

  const handleOnExecuteWorkflow = (values: Record<string, string>) => {
    if (activeWorkflow == null) {
      addToastNotification({
        content: 'We cannot execute undefined workflow',
        type: 'error',
      });

      return null;
    }

    const { executeWorkflow } = callbackUtils.getCallbacks;

    return executeWorkflow({
      input: values,
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
