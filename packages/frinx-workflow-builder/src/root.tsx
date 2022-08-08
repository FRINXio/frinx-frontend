import { Box, ChakraProvider, Container, Heading } from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { unwrap } from '@frinx/shared/src';
import App from './app';
import callbackUtils from './callback-utils';
import WorkflowForm from './components/workflow-form/workflow-form';
import { ExtendedTask, TaskDefinition, Workflow } from './helpers/types';
import { convertWorkflow, createEmptyWorkflow } from './helpers/workflow.helpers';
import { TaskActionsProvider } from './task-actions-context';
import theme from './theme';

type Props = {
  onClose: () => void;
};

const Root: VoidFunctionComponent<Props> = ({ onClose }) => {
  const { name, version } = useParams<{ name: string; version: string }>();
  const [workflow, setWorkflow] = useState<Workflow<ExtendedTask> | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
  const [taskDefinitions, setTaskDefinitions] = useState<TaskDefinition[] | null>(null);
  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState(false);

  useEffect(() => {
    if (name != null && version != null) {
      const { getWorkflow } = callbackUtils.getCallbacks;
      getWorkflow(name, Number(version)).then((wf) => {
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
    if (workflow != null) {
      const { deleteWorkflow } = callbackUtils.getCallbacks;
      deleteWorkflow(workflow.name, workflow.version.toString()).then(() => {
        onClose();
      });
    }
  };

  if (shouldCreateWorkflow && workflows != null) {
    return (
      <ChakraProvider theme={theme}>
        <Container maxWidth={1200}>
          <Box background="white" paddingY={8} paddingX={4}>
            <Heading as="h1" size="lg">
              Create new workflow
            </Heading>
            <WorkflowForm
              workflow={createEmptyWorkflow()}
              workflows={workflows}
              onSubmit={(wf) => {
                setWorkflow({
                  ...wf,
                  ownerEmail: '',
                  schemaVersion: 2,
                  tasks: [],
                  updateTime: 0,
                });
                setShouldCreateWorkflow(false);
              }}
              canEditName
              isCreatingWorkflow
            />
          </Box>
        </Container>
      </ChakraProvider>
    );
  }

  return workflow != null && workflows != null && taskDefinitions != null ? (
    <ChakraProvider theme={theme}>
      <TaskActionsProvider>
        <App
          key={`${name}/${version}/${workflow.name}`}
          workflow={workflow}
          onWorkflowChange={(editedWorkflow) => {
            setWorkflow((wf) => ({
              ...unwrap(wf),
              ...editedWorkflow,
            }));
          }}
          workflows={workflows}
          taskDefinitions={taskDefinitions}
          onFileImport={handleFileImport}
          onFileExport={handleFileExport}
          onWorkflowDelete={handleWorkflowDelete}
          onWorkflowClone={handleWorkflowClone}
        />
      </TaskActionsProvider>
    </ChakraProvider>
  ) : null;
};

export default Root;
