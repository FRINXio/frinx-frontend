import { UseDisclosureReturn } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { ScheduledWorkflow, Workflow } from '@frinx/workflow-ui/src/helpers/types';
import React, { VoidFunctionComponent } from 'react';
import {
  DefinitionModal,
  DiagramModal,
  DependencyModal,
  ScheduledWorkflowModal,
  ExecuteWorkflowModal,
  ConfirmDeleteModal,
} from '@frinx/workflow-ui/src/common/modals';
import {
  parseInputParameters,
  getDynamicInputParametersFromWorkflow,
} from '@frinx/workflow-ui/src/utils/helpers.utils';

type Props = {
  workflows: Workflow[];
  activeWorkflow?: Workflow;
  definitionModal: UseDisclosureReturn;
  diagramModal: UseDisclosureReturn;
  dependencyModal: UseDisclosureReturn;
  executeWorkflowModal: UseDisclosureReturn;
  scheduledWorkflowModal: UseDisclosureReturn;
  confirmDeleteModal: UseDisclosureReturn;
  getData: () => void;
};

const WorkflowDefinitionsModals: VoidFunctionComponent<Props> = ({
  workflows,
  activeWorkflow,
  confirmDeleteModal,
  definitionModal,
  dependencyModal,
  diagramModal,
  executeWorkflowModal,
  getData,
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
          getData();
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
      deleteWorkflow(activeWorkflow.name, activeWorkflow.version)
        .then(() => {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Successfully deleted workflow',
          });
          getData();
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
      version: activeWorkflow.version,
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

  return (
    <>
      <DefinitionModal workflow={activeWorkflow} isOpen={definitionModal.isOpen} onClose={definitionModal.onClose} />
      {activeWorkflow != null && (
        <DiagramModal workflow={activeWorkflow} isOpen={diagramModal.isOpen} onClose={diagramModal.onClose} />
      )}
      <DependencyModal
        workflow={activeWorkflow}
        onClose={dependencyModal.onClose}
        isOpen={dependencyModal.isOpen}
        workflows={workflows}
      />
      {activeWorkflow != null && (
        <ScheduledWorkflowModal
          workflow={{
            workflowName: activeWorkflow.name,
            workflowVersion: activeWorkflow.version,
          }}
          onClose={scheduledWorkflowModal.onClose}
          isOpen={scheduledWorkflowModal.isOpen}
          onSubmit={handleWorkflowSchedule}
        />
      )}
      {activeWorkflow != null && (
        <ExecuteWorkflowModal
          parsedInputParameters={parseInputParameters(activeWorkflow?.inputParameters)}
          dynamicInputParameters={getDynamicInputParametersFromWorkflow(activeWorkflow)}
          onClose={executeWorkflowModal.onClose}
          isOpen={executeWorkflowModal.isOpen}
          workflowName={activeWorkflow.name}
          workflowDescription={activeWorkflow.description}
          onSubmit={handleOnExecuteWorkflow}
        />
      )}
      {activeWorkflow != null && (
        <ConfirmDeleteModal
          activeWorkflow={activeWorkflow}
          isOpen={confirmDeleteModal.isOpen}
          onClose={confirmDeleteModal.onClose}
          onDelete={handleOnDeleteWorkflowClick}
        />
      )}
    </>
  );
};

export default WorkflowDefinitionsModals;
