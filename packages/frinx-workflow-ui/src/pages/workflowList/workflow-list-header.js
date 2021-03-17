// @flow
import PageContainer from '../../common/PageContainer';
import React from 'react';
import callbackUtils from '../../utils/callbackUtils';
import { Button, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSZip } from 'jszip';
import { faCogs, faFileExport, faFileImport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';

type Props = {
  onAddButtonClick: () => void,
};

const WorkflowListHeader = ({ onAddButtonClick }: Props) => {
  const importFiles = (e) => {
    const files = e.currentTarget.files;
    const fileList = [];
    let count = files.length;

    Object.keys(files).forEach((i) => {
      readFile(files[i]);
    });

    function readFile(file) {
      const reader = new FileReader();
      const putWorkflow = callbackUtils.putWorkflowCallback();

      reader.onload = (e) => {
        const definition = JSON.parse(e.target.result);
        fileList.push(definition);
        if (!--count) {
          putWorkflow(fileList).then(() => {
            window.location.reload();
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const openFileUpload = () => {
    document.getElementById('upload-files').click();
    document.getElementById('upload-files').addEventListener('change', importFiles);
  };

  const exportFile = () => {
    const getWorkflows = callbackUtils.getWorkflowsCallback();

    getWorkflows().then((workflows) => {
      const zip = new JSZip();

      workflows.forEach((wf) => {
        zip.file(wf.name + '.json', JSON.stringify(wf, null, 2));
      });

      zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'workflows.zip');
      });
    });
  };

  return (
    <PageContainer>
      <Heading as="h1" marginBottom={20}>
        <Stack spacing={4} direction="row">
          <Icon as={FontAwesomeIcon} icon={faCogs} color="grey" />
          <Text>Workflows</Text>

          <Button
            variant="outline"
            leftIcon={<Icon as={FontAwesomeIcon} icon={faPlus} />}
            colorScheme="blue"
            onClick={onAddButtonClick}
          >
            New
          </Button>
          <Button
            variant="outline"
            leftIcon={<Icon as={FontAwesomeIcon} icon={faFileImport} />}
            colorScheme="blue"
            onClick={openFileUpload}
          >
            Import
          </Button>
          <Button
            variant="outline"
            leftIcon={<Icon as={FontAwesomeIcon} icon={faFileExport} />}
            colorScheme="blue"
            onClick={() => exportFile()}
          >
            Export
          </Button>
        </Stack>
      </Heading>
      <input id="upload-files" multiple type="file" hidden />
    </PageContainer>
  );
};

export default WorkflowListHeader;
