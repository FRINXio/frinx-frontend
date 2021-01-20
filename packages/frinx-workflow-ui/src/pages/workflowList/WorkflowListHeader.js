// @flow
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { HttpClient as http } from '../../common/HttpClient';
import { exportButton } from './workflowUtils';
import { GlobalContext } from '../../common/GlobalContext';
import { useRouteMatch, useHistory } from 'react-router-dom';
import PageContainer from '../../common/PageContainer';

const workflowModifyButtons = (openFileUpload, history, frontendUrlPrefix) => {
  console.log(frontendUrlPrefix)
  return [
    <Button
      key="builder-btn"
      variant="outline-primary"
      style={{ marginLeft: '30px' }}
      onClick={() => history.push(frontendUrlPrefix + '/builder')}
    >
      <i className="fas fa-plus" />
      &nbsp;&nbsp;New
    </Button>,
    <Button key="import-btn" variant="outline-primary" style={{ marginLeft: '5px' }} onClick={openFileUpload}>
      <i className="fas fa-file-import" />
      &nbsp;&nbsp;Import
    </Button>,
  ];
};

const upperMenu = (history, openFileUpload, backendApiUrlPrefix, frontendUrlPrefix) => {
  return (
    <h1 style={{ marginBottom: '20px' }}>
      <i style={{ color: 'grey' }} className="fas fa-cogs" />
      &nbsp;&nbsp;Workflows
      {workflowModifyButtons(openFileUpload, history, frontendUrlPrefix)}
      {exportButton({ backendApiUrlPrefix: backendApiUrlPrefix })}
    </h1>
  );
};

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

  let menu = upperMenu(history, openFileUpload, global.backendApiUrlPrefix, path);

  return (
    <PageContainer>
      {menu}
      <input id="upload-files" multiple type="file" hidden />
    </PageContainer>
  );
};

export default WorkflowListHeader;
