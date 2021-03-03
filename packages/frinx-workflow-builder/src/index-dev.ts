/* eslint-disable no-template-curly-in-string */
import { createElement } from 'react';
import { render } from 'react-dom';
import { HTTPTask, TaskDefinition, Workflow } from './helpers/types';
import Root from './root';

const mountElement = document.querySelector('#root');

if (mountElement == null) {
  throw new Error('#root element not found');
}

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
          ({
            name: '1GLOBAL___HTTP_task',
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
          } as unknown) as HTTPTask,
          ({
            name: '11GLOBAL___HTTP_task',
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
          } as unknown) as HTTPTask,
        ],
      },
      defaultCase: [
        ({
          name: '2GLOBAL___HTTP_task',
          taskReferenceName: 'httpRequestTaskRef_S3NZ',
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
        } as unknown) as HTTPTask,
        ({
          name: '22GLOBAL___HTTP_task',
          taskReferenceName: 'httpRequestTaskRef_S3NZ',
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
        } as unknown) as HTTPTask,
      ],
      inputParameters: {
        param: 'true',
      },
      optional: false,
      startDelay: 0,
    },
    ({
      name: '3GLOBAL___HTTP_task',
      taskReferenceName: 'httpRequestTaskRef_S3NZ',
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
    } as unknown) as HTTPTask,
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
  return Promise.resolve();
}

async function getWorkflows(): Promise<Workflow[]> {
  const data = await fetch('http://10.19.0.7/api/uniflow/conductor/metadata/workflow').then((res) => res.json());

  return data.result;
}

async function getTaskDefinitions(): Promise<TaskDefinition[]> {
  const data = await fetch('http://10.19.0.7/api/uniflow/conductor/metadata/taskdefs').then((res) => res.json());

  return data.result;
}

const handleClose = () => {
  console.log('CLOSE');
};

render(
  createElement(Root, {
    onClose: handleClose,
    getWorkflowCallback: getWorkflow,
    saveWorkflowCallback: saveWorkflow,
    getWorkflowsCallback: getWorkflows,
    getTaskDefinitionsCallback: getTaskDefinitions,
    name: '1',
    version: '2',
  }),
  mountElement,
);
