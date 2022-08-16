// @flow
import PageContainer from '../../common/PageContainer';
import React, { useRef } from 'react';
import callbackUtils from '../../utils/callback-utils';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VisuallyHidden,
  Icon,
} from '@chakra-ui/react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@frinx/shared/src';
import { compact } from 'lodash';

type Props = {
  onImportSuccess: () => void;
};

function readFile(file: File): Promise<any> {
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

const WorkflowListHeader = ({ onImportSuccess }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToastNotification } = useNotifications();

  const importFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    try {
      const readFiles = await Promise.all(Array.from(compact(files)).map((f) => readFile(f)));
      const json = readFiles.map((data) => JSON.parse(data));
      const { putWorkflow } = callbackUtils.getCallbacks;
      await putWorkflow(json);
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
    }
  };

  const openFileUpload = () => {
    inputRef.current?.click();
  };

  const exportFile = () => {
    const { getWorkflows } = callbackUtils.getCallbacks;

    getWorkflows().then((workflows) => {
      const zip = new JSZip();

      workflows.forEach((wf) => {
        zip.file(wf.name + '.json', JSON.stringify(wf, null, 2));
      });

      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'workflows.zip');
      });
    });
  };

  return (
    <PageContainer>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Workflows
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
                  <MenuItem onClick={exportFile}>
                    <Box as="span" fontSize="sm" paddingRight={3} flexShrink={0}>
                      <Box
                        as={FeatherIcon}
                        size="1em"
                        icon="download"
                        flexShrink={0}
                        lineHeight={4}
                        verticalAlign="middle"
                      />
                    </Box>
                    Export workflows
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
    </PageContainer>
  );
};

export default WorkflowListHeader;
