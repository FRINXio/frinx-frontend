import { Box, Container, Heading } from '@chakra-ui/react';
import {
  callbackUtils,
  convertWorkflow,
  createEmptyWorkflow,
  ExtendedTask,
  TaskDefinition,
  unwrap,
  Workflow,
  useNotifications,
} from '@frinx/shared/src';
import { saveAs } from 'file-saver';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import App from './app';
import WorkflowForm from './components/workflow-form/workflow-form';
import { TaskActionsProvider } from './task-actions-context';

type Props = {
  onClose: () => void;
};

const Root: VoidFunctionComponent<Props> = ({ onClose }) => {
  const { name, version } = useParams<{ name: string; version: string }>();
  const [workflow, setWorkflow] = useState<Workflow<ExtendedTask> | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
  const [taskDefinitions, setTaskDefinitions] = useState<TaskDefinition[] | null>(null);
  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState(false);

  const {addToastNotification} = useNotifications()

  useEffect(() => {
    if (name != null && version != null) {
      const { getWorkflow } = callbackUtils.getCallbacks;
      getWorkflow(name, version).then((wf) => {
        setWorkflow(convertWorkflow(wf));
      });
    } else {
      setShouldCreateWorkflow(true);
    }
  }, [name, version]);

  useEffect(() => {
    const { getWorkflows } = callbackUtils.getCallbacks;
    getWorkflows().then((wfs) => {
      setWorkflows(wfs);
    });
  }, []);

  useEffect(() => {
    const { getTaskDefinitions } = callbackUtils.getCallbacks;
    getTaskDefinitions().then((tsks) => {
      setTaskDefinitions(tsks);
    });
  }, []);

  const handleFileImport = (file: File) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setWorkflow(json);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });

    fileReader.readAsText(file);
  };

  const handleFileExport = (wf: Workflow) => {
    const parsedWf = JSON.stringify(wf, null, 2);
    const textEncoder = new TextEncoder();
    const arrayBuffer = textEncoder.encode(parsedWf);
    const file = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${wf.name}.json`);
  };

  const handleWorkflowClone = (wf: Workflow, wfName: string) => {
    const updatedWorkflow: Workflow = { ...wf, name: wfName };
    const { putWorkflow } = callbackUtils.getCallbacks;

    putWorkflow([updatedWorkflow]);
  };

  const handleWorkflowDelete = () => {
    const { getWorkflows } = callbackUtils.getCallbacks;
    getWorkflows().then((wfs) => {
      const wfExists = wfs.find((wf) => wf.name === workflow?.name);
      if (wfExists != null && workflow != null) {
        const { deleteWorkflow } = callbackUtils.getCallbacks;
        deleteWorkflow(workflow.name, workflow.version.toString()).then(() => {
          onClose();
        });
      }
      if (!wfExists) {
        addToastNotification({
          content: 'No workflow definition to be deleted',
          type: 'error',
        })
      }
    });
    
  };

  const handleWorkflowChange = (
    editedWorkflow: Pick<
      Workflow,
      | 'name'
      | 'description'
      | 'version'
      | 'restartable'
      | 'timeoutPolicy'
      | 'timeoutSeconds'
      | 'outputParameters'
      | 'variables'
    >,
  ) => {
    setWorkflow((wf) => ({
      ...unwrap(wf),
      ...editedWorkflow,
    }));
  };

  if (shouldCreateWorkflow && workflows != null) {
    return (
      <Container maxWidth={1200}>
        <Box background="white" paddingY={8} paddingX={4}>
          <Heading as="h1" size="xl">
            Create new workflow
          </Heading>
          <WorkflowForm
            workflow={createEmptyWorkflow()}
            workflows={workflows}
            onSubmit={(wf) => {
              setWorkflow({
                ownerEmail: '',
                schemaVersion: 2,
                tasks: [],
                updateTime: 0,
                hasSchedule: false,
                correlationId: '',
                ...wf,
              });
              setShouldCreateWorkflow(false);
            }}
            canEditName
            isCreatingWorkflow
          />
        </Box>
      </Container>
    );
  }

  return workflow != null && workflows != null && taskDefinitions != null ? (
    <TaskActionsProvider>
      <ReactFlowProvider>
        <App
          key={`${name}/${version}/${workflow.name}`}
          workflow={workflow}
          onWorkflowChange={handleWorkflowChange}
          workflows={workflows}
          taskDefinitions={taskDefinitions}
          onFileImport={handleFileImport}
          onFileExport={handleFileExport}
          onWorkflowDelete={handleWorkflowDelete}
          onWorkflowClone={handleWorkflowClone}
        />
      </ReactFlowProvider>
    </TaskActionsProvider>
  ) : null;
};

export default Root;
