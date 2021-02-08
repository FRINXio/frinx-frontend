// @flow
import React from 'react';
import { Button } from 'react-bootstrap';
import PageContainer from '../../common/PageContainer';
import callbackUtils from '../../utils/callbackUtils';

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
        let definition = JSON.parse(e.target.result);
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

      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'workflows.zip');
      });
    });
  };

  return (
    <PageContainer>
      <h1 style={{ marginBottom: '20px' }}>
        <i style={{ color: 'grey' }} className="fas fa-cogs" />
        &nbsp;&nbsp;Workflows
        <Button key="builder-btn" variant="outline-primary" style={{ marginLeft: '30px' }} onClick={onAddButtonClick}>
          <i className="fas fa-plus" />
          &nbsp;&nbsp;New
        </Button>
        <Button key="import-btn" variant="outline-primary" style={{ marginLeft: '5px' }} onClick={openFileUpload}>
          <i className="fas fa-file-import" />
          &nbsp;&nbsp;Import
        </Button>
        <Button key="export-btn" variant="outline-primary" style={{ marginLeft: '5px' }} onClick={() => exportFile()}>
          <i className="fas fa-file-export" />
          &nbsp;&nbsp;Export
        </Button>
      </h1>
      <input id="upload-files" multiple type="file" hidden />
    </PageContainer>
  );
};

export default WorkflowListHeader;
