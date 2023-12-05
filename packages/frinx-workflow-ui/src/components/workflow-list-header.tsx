import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { compact } from 'lodash';
import React, { useRef, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation } from 'urql';
import { CreateWorkflowMutation, CreateWorkflowMutationVariables } from '../__generated__/graphql';

type Props = {
  onImportSuccess: () => void;
};

const CREATE_WORKFLOW_MUTATION = gql`
  mutation CreateWorkflow($input: UpdateWorkflowInput!) {
    updateWorkflow(id: "", input: $input) {
      workflow {
        createdBy
        updatedAt
        tasks
        name
        description
        version
        outputParameters {
          key
          value
        }
      }
    }
  }
`;

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      try {
        const json = JSON.parse(JSON.stringify(event.target?.result));
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });

    reader.addEventListener('error', (err) => {
      reject(err);
    });
    reader.readAsBinaryString(file);
  });
}

const WorkflowListHeader: VoidFunctionComponent<Props> = ({ onImportSuccess }) => {
  const [, createWorkflow] = useMutation<CreateWorkflowMutation, CreateWorkflowMutationVariables>(
    CREATE_WORKFLOW_MUTATION,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToastNotification } = useNotifications();

  const importFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    try {
      const readFiles = await Promise.all(Array.from(compact(files)).map((f) => readFile(f)));
      const json = readFiles
        .map((data) => JSON.parse(data))
        .map((data) => {
          const { tasks, name, description, outputParameters, restartable, timeoutSeconds, version } = data;
          return {
            tasks: JSON.stringify(tasks),
            name,
            description,
            outputParameters,
            restartable,
            timeoutSeconds,
            version,
          };
        });
      await Promise.all(json.map((workflow) => createWorkflow({ input: { workflow } })));
      onImportSuccess();
      addToastNotification({
        type: 'success',
        content: `Workflow successfully imported`,
      });
    } catch {
      addToastNotification({
        type: 'error',
        content: `Workflow upload error. Check workflow definition and/or syntax.`,
      });
    } finally {
      // chrome does not allow to send same file twice (so we nullify it after sending the data)
      // onchange event occurs when a control loses the input focus
      // and its value has been modified since gaining focus
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const openFileUpload = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Workflow definitions
        </Heading>
        <Box marginLeft="auto">
          <HStack>
            <Button
              as={Link}
              leftIcon={<Icon as={FeatherIcon} icon="plus" size={20} />}
              colorScheme="blue"
              to="../builder"
            >
              Create
            </Button>
            <Box>
              <Menu isLazy>
                <MenuButton
                  as={IconButton}
                  icon={<Icon as={FeatherIcon} icon="settings" size={20} />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItem onClick={openFileUpload}>
                    <Box as="span" fontSize="sm" paddingRight={3} flexShrink={0}>
                      <Box
                        as={FeatherIcon}
                        size="1em"
                        icon="file-plus"
                        flexShrink={0}
                        lineHeight={4}
                        verticalAlign="middle"
                      />
                    </Box>
                    Import workflow
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        </Box>
      </Flex>
      <VisuallyHidden>
        <Input id="upload-files" multiple type="file" ref={inputRef} onChange={importFiles} />
      </VisuallyHidden>
    </>
  );
};

export default WorkflowListHeader;
