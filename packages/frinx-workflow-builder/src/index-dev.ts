/* eslint-disable no-template-curly-in-string */
import { createElement } from 'react';
import { render } from 'react-dom';
import Root from './root';

const mountElement = document.querySelector('#root');

if (mountElement == null) {
  throw new Error('#root element not found');
}

const hash = () => Math.random().toString(36).toUpperCase().substr(2, 4);

const workflow = {
  updateTime: 1607938645688,
  name: 'test test',
  description: '',
  version: 1,
  tasks: [
    {
      name: 'GLOBAL___HTTP_task',
      taskReferenceName: 'httpRequestTaskRef_S3NY',
      inputParameters: {
        http_request: {
          uri: '${workflow.input.uri}',
          method: 'GET',
          contentType: 'application/json',
          headers: {
            from: 'frinxUser',
            'x-auth-user-roles': 'OWNER',
            'x-tenant-id': 'frinx_test',
          },
          timeout: 3600,
        },
      },
      type: 'SIMPLE',
      decisionCases: {},
      defaultCase: [],
      forkTasks: [],
      startDelay: 0,
      joinOn: [],
      optional: false,
      defaultExclusiveJoinTask: [],
      asyncComplete: false,
      loopOver: [],
    },
    {
      name: 'GLOBAL___js',
      taskReferenceName: `lambdaJsTaskRef_${hash()}`,
      type: 'SIMPLE',
      inputParameters: {
        lambdaValue: '${workflow.input.lambdaValue}',
        scriptExpression: `if ($.lambdaValue == 1) {
return {testvalue: true};
} else {
return {testvalue: false};
}`,
      },
      optional: false,
      startDelay: 0,
    },
    {
      name: 'GLOBAL___HTTP_task',
      taskReferenceName: 'graphQLTaskRef_UAS4',
      inputParameters: {
        http_request: {
          uri: '${workflow.input.uri}',
          method: 'POST',
          contentType: 'application/json',
          headers: {
            from: 'frinxUser',
            'x-auth-user-roles': 'OWNER',
            'x-tenant-id': 'frinx_test',
          },
          body: {
            query: 'query queryResourceTypes {\n     QueryResourceTypes{\n         ID\n         Name\n     }\n }',
            variables: {},
          },
          timeout: 3600,
        },
      },
      type: 'SIMPLE',
      decisionCases: {},
      defaultCase: [],
      forkTasks: [],
      startDelay: 0,
      joinOn: [],
      optional: false,
      defaultExclusiveJoinTask: [],
      asyncComplete: false,
      loopOver: [],
    },
  ],
  inputParameters: [],
  outputParameters: {},
  schemaVersion: 2,
  restartable: true,
  workflowStatusListenerEnabled: false,
  ownerEmail: 'frinxuser',
  timeoutPolicy: 'ALERT_ONLY',
  timeoutSeconds: 0,
  variables: {},
};

const handleClose = () => {
  console.log('CLOSE');
};

render(createElement(Root, { workflow, onClose: handleClose }), mountElement);
