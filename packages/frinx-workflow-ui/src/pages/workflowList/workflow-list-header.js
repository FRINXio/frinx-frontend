// @flow
import PageContainer from '../../common/PageContainer';
import React, { useRef } from 'react';
import callbackUtils from '../../utils/callbackUtils';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VisuallyHidden,
} from '@chakra-ui/react';
import { SettingsIcon, SmallAddIcon } from '@chakra-ui/icons';
import JSZip from 'jszip';
import { faCogs, faFileExport, faFileImport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import FeatherIcon from 'feather-icons-react';

type Props = {
  onAddButtonClick: () => void,
  onImportSuccess: () => void,
};

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(JSON.parse(event.target.result));
    });

    reader.addEventListener('error', (err) => {
      reject(err);
    });
    reader.readAsBinaryString(file);
  });
}

const WorkflowListHeader = ({ onAddButtonClick, onImportSuccess }: Props) => {
  const inputRef = useRef();

  const importFiles = async (e) => {
    const { files } = e.currentTarget;
    const readFiles = await Promise.all(Array.from(files).map((f) => readFile(f)));
    const putWorkflow = callbackUtils.putWorkflowCallback();
    putWorkflow(readFiles).then(() => {
      onImportSuccess();
    });
  };

  const openFileUpload = () => {
    inputRef.current?.click();
  };

  const exportFile = () => {
    const getWorkflows = callbackUtils.getWorkflowsCallback();

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
          <ButtonGroup>
            <Button leftIcon={<SmallAddIcon />} colorScheme="blue" onClick={onAddButtonClick}>
              Create
            </Button>
            <Menu isLazy>
              <MenuButton as={IconButton} icon={<SettingsIcon />} variant="ghost" />
              <MenuList>
                <MenuItem onClick={openFileUpload}>
                  <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
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
                  <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
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
          </ButtonGroup>
        </Box>
      </Flex>
      <VisuallyHidden>
        <Input id="upload-files" multiple type="file" ref={inputRef} onChange={importFiles} />
      </VisuallyHidden>
    </PageContainer>
  );
};

export default WorkflowListHeader;
