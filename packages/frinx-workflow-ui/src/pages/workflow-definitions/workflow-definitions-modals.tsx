import { UseDisclosureReturn } from '@chakra-ui/react';
import { useNotifications, ExecuteWorkflowModal, unwrap, ClientWorkflow, ClientWorkflowWithTasks } from '@frinx/shared';
import { gql, useMutation } from 'urql';
import React, { VoidFunctionComponent } from 'react';
import {
  DefinitionModal,
  DependencyModal,
  ScheduleWorkflowModal,
  ConfirmDeleteModal,
  DiagramModal,
} from '../../components/modals';
import {
  CreateScheduleInput,
  CreateScheduleMutation,
  CreateScheduleMutationVariables,
  ExecuteWorkflowByNameMutation,
  ExecuteWorkflowByNameMutationVariables,
  ExportWorkflowMutation,
  ExportWorkflowMutationVariables,
} from '../../__generated__/graphql';

type Props = {
  workflows: ClientWorkflowWithTasks[];
  activeWorkflow?: ClientWorkflowWithTasks;
  definitionModal: UseDisclosureReturn;
  diagramModal: UseDisclosureReturn;
  dependencyModal: UseDisclosureReturn;
  executeWorkflowModal: UseDisclosureReturn;
  scheduledWorkflowModal: UseDisclosureReturn;
  confirmDeleteModal: UseDisclosureReturn;
  onDeleteWorkflow: (workflow: ClientWorkflow) => Promise<void>;
};

const CREATE_SCHEDULE_MUTATION = gql`
  mutation CreateSchedule($input: CreateScheduleInput!) {
    scheduler {
      createSchedule(input: $input) {
        name
        enabled
        workflowName
        workflowVersion
        cronString
        workflowContext
        fromDate
        toDate
      }
    }
  }
`;

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowByName($input: ExecuteWorkflowByNameInput!) {
    conductor {
      executeWorkflowByName(input: $input)
    }
  }
`;

const EXPORT_WORKFLOW_MUTATION = gql`
  mutation ExportWorkflowDefinition($name: String!, $version: Int) {
    conductor {
      exportWorkflowDefinition(name: $name, version: $version)
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
  const [, createSchedule] = useMutation<CreateScheduleMutation, CreateScheduleMutationVariables>(
    CREATE_SCHEDULE_MUTATION,
  );

  const [, onExecute] = useMutation<ExecuteWorkflowByNameMutation, ExecuteWorkflowByNameMutationVariables>(
    EXECUTE_WORKFLOW_MUTATION,
  );

  const [, exportWorkflow] = useMutation<ExportWorkflowMutation, ExportWorkflowMutationVariables>(
    EXPORT_WORKFLOW_MUTATION,
  );

  const { addToastNotification } = useNotifications();

  const handleWorkflowSchedule = (scheduledWf: CreateScheduleInput) => {
    const scheduleInput = {
      ...scheduledWf,
      cronString: unwrap(scheduledWf.cronString),
    };
    if (scheduledWf.workflowName != null && scheduledWf.workflowVersion != null) {
      createSchedule({ input: scheduleInput })
        .then((res) => {
          if (!res.data?.scheduler.createSchedule) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.scheduler.createSchedule || !res.error) {
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
    return onExecute({
      input: {
        inputParameters: JSON.stringify(values),
        workflowName: activeWorkflow.name,
        workflowVersion: activeWorkflow.version,
      },
    })
      .then((res) => {
        if (!res.error) {
          addToastNotification({ content: 'We successfully executed workflow', type: 'success' });
          return res.data?.conductor.executeWorkflowByName;
        }
        if (res.error) {
          addToastNotification({ content: res.error.message, type: 'error' });
        }
        return null;
      })
      .catch(() => {
        addToastNotification({ content: 'We have a problem to execute selected workflow', type: 'error' });
        return null;
      });
  };

  const handleOnExportClick = () => {
    if (activeWorkflow == null) {
      addToastNotification({
        content: 'We cannot export undefined workflow',
        type: 'error',
      });

      return;
    }

    exportWorkflow({
      name: activeWorkflow.name,
      version: activeWorkflow.version,
    })
      .then((res) => {
        if (!res.error) {
          const workflowDefinition = res.data?.conductor.exportWorkflowDefinition;

          const file = new Blob([JSON.stringify(workflowDefinition, null, 2)], { type: 'application/json' });
          const a = document.createElement('a');
          const url = URL.createObjectURL(file);
          a.href = url;
          a.download = `${activeWorkflow.name}.json`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }

        if (res.error) {
          addToastNotification({ content: res.error.message, type: 'error' });
        }
      })
      .catch(() => {
        addToastNotification({ content: 'We have a problem to export selected workflow', type: 'error' });
      });
  };

  if (activeWorkflow == null) {
    return null;
  }

  return (
    <>
      <DefinitionModal
        workflow={activeWorkflow}
        isOpen={definitionModal.isOpen}
        onClose={definitionModal.onClose}
        onExportClick={handleOnExportClick}
      />
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
      <DiagramModal workflow={activeWorkflow} onClose={diagramModal.onClose} isOpen={diagramModal.isOpen} />
    </>
  );
};

export default WorkflowDefinitionsModals;
