/* eslint-disable */
import { createElement } from 'react';
import { render } from 'react-dom';
import { getBuilderApiProvider } from './builder-api-provider';
import { HTTPTask, TaskDefinition, Workflow, SubworkflowTask } from './helpers/types';
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
      name: '1. decisionTask',
      type: 'DECISION',
      taskReferenceName: 'decisionTaskRef_1234',
      caseValueParam: 'param',
      decisionCases: {
        true: [
          {
            name: '1. if[0]',
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
          } as unknown as HTTPTask,
          {
            name: '1. if[1] decision',
            type: 'DECISION',
            taskReferenceName: 'decisionTaskRef_1234',
            caseValueParam: 'param',
            decisionCases: {
              true: [
                {
                  name: '2. if[0]',
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
                } as unknown as HTTPTask,
                {
                  name: '2. if[1]',
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
                } as unknown as HTTPTask,
              ],
            },
            defaultCase: [
              {
                name: '2. else[0]',
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
              } as unknown as HTTPTask,
              {
                name: '2. else[1]',
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
              } as unknown as HTTPTask,
            ],
            inputParameters: {
              param: 'true',
            },
            optional: false,
            startDelay: 0,
          },
          {
            name: '1. if[2]',
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
          } as unknown as HTTPTask,
        ],
      },
      defaultCase: [
        {
          name: '1. else[0]',
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
        } as unknown as HTTPTask,
        {
          name: '1. else[1]',
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
        } as unknown as HTTPTask,
      ],
      inputParameters: {
        param: 'true',
      },
      optional: false,
      startDelay: 0,
    },
    {
      name: '3. task',
      taskReferenceName: 'subWorkflowTaskRef_S3NZ',
      inputParameters: {
        foo: '${workflow.input.foo}',
      },
      type: 'SUB_WORKFLOW',
      subWorkflowParam: {
        name: 'Test workflow',
        version: 1,
      },
      startDelay: 0,
      optional: false,
      asyncComplete: false,
    } as unknown as SubworkflowTask,
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

const BuilderApiProvider = getBuilderApiProvider({
  getWorkflow,
  getWorkflows,
  getTaskDefinitions,
  putWorkflow: saveWorkflow,
  deleteWorkflow: () => Promise.resolve(),
  executeWorkflow: () => Promise.resolve(),
  getWorkflowExecutions: () => Promise.resolve(),
  getWorkflowInstanceDetail: () => Promise.resolve(),
});

// @ts-ignore
render(createElement(BuilderApiProvider, null, createElement(Root, { name: '1', version: '2' })), mountElement);
