// @flow
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { HttpClient as http } from '../../common/HttpClient';
import { GlobalContext } from '../../common/GlobalContext';
import { useRouteMatch, useHistory } from 'react-router-dom';
import PageContainer from '../../common/PageContainer';

const WorkflowListHeader = () => {
  const global = useContext(GlobalContext);
  const history = useHistory();
  const { path } = useRouteMatch();

  const importFiles = e => {
    const files = e.currentTarget.files;
    const fileList = [];
    let count = files.length;

    Object.keys(files).forEach(i => {
      readFile(files[i]);
    });

    function readFile(file) {
      const reader = new FileReader();
      reader.onload = e => {
        let definition = JSON.parse(e.target.result);
        fileList.push(definition);
        if (!--count) {
          http.put(global.backendApiUrlPrefix + '/metadata', fileList).then(() => {
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

  const exportFile = backendApiUrlPrefix => {
    http.get(backendApiUrlPrefix + '/metadata/workflow').then(res => {
      const zip = new JSZip();
      let workflows = res.result || [];

      workflows.forEach(wf => {
        zip.file(wf.name + '.json', JSON.stringify(wf, null, 2));
      });

      zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'workflows.zip');
      });
    });
  };

  return (
    <PageContainer>
      <h1 style={{ marginBottom: '20px' }}>
        <i style={{ color: 'grey' }} className="fas fa-cogs" />
        &nbsp;&nbsp;Workflows
        <Button
          key="builder-btn"
          variant="outline-primary"
          style={{ marginLeft: '30px' }}
          onClick={() => history.push(path + '/builder')}
        >
          <i className="fas fa-plus" />
          &nbsp;&nbsp;New
        </Button>
        <Button key="import-btn" variant="outline-primary" style={{ marginLeft: '5px' }} onClick={openFileUpload}>
          <i className="fas fa-file-import" />
          &nbsp;&nbsp;Import
        </Button>
        <Button
          key="export-btn"
          variant="outline-primary"
          style={{ marginLeft: '5px' }}
          onClick={() => exportFile(global.backendApiUrlPrefix)}
        >
          <i className="fas fa-file-export" />
          &nbsp;&nbsp;Export
        </Button>
      </h1>
      <input id="upload-files" multiple type="file" hidden />
    </PageContainer>
  );
};

export default WorkflowListHeader;
