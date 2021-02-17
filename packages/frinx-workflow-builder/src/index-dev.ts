/* eslint-disable no-template-curly-in-string */
import { createElement } from 'react';
import { render } from 'react-dom';
import { Task, Workflow } from './helpers/types';
import Root from './root';

const mountElement = document.querySelector('#root');

if (mountElement == null) {
  throw new Error('#root element not found');
}

const hash = () => Math.random().toString(36).toUpperCase().substr(2, 4);

const workflow: Workflow = {
  updateTime: 1607938645688,
  name: 'test test',
  description: 'sample description',
  version: 1,
  tasks: [
    {
      name: 'decisionTask',
      type: 'DECISION',
      taskReferenceName: 'decisionTaskRef_1234',
      caseValueParam: 'param',
      decisionCases: {
        true: [
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
            startDelay: 0,
            optional: false,
            asyncComplete: false,
          },
        ],
      },
      defaultCase: [],
      inputParameters: {
        param: 'true',
      },
      optional: false,
      ownerEmail: 'frinxUser',
      pollTimeoutSeconds: 0,
      responseTimeoutSeconds: 10,
      retryCount: 0,
      retryDelaySeconds: 0,
      retryLogic: 'EXPONENTIAL_BACKOFF',
      startDelay: 0,
      timeoutPolicy: 'TIME_OUT_WF',
      timeoutSeconds: 60,
      description: '',
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

function getWorkflow(): Promise<Workflow> {
  return Promise.resolve(workflow);
}

function saveWorkflow(wfs: Workflow[]): Promise<unknown> {
  console.log(wfs);
  return Promise.resolve();
}

const handleClose = () => {
  console.log('CLOSE');
};

render(
  createElement(Root, {
    onClose: handleClose,
    getWorkflowCallback: getWorkflow,
    saveWorkflowCallback: saveWorkflow,
    name: '1',
    version: '2',
  }),
  mountElement,
);
