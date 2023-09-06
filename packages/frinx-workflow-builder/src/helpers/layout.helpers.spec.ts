import { describe, expect, test } from 'vitest';
import { getLayoutedElements } from './layout.helpers';

const RAW_ELEMENTS = {
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        label: 'start',
        isReadOnly: true,
      },
    },
    {
      id: 'lambda_YGO1',
      type: 'base',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        label: 'lambda_YGO1',
        task: {
          id: '28bb62be-f241-4b11-b09b-3d2e6c9d128f',
          label: 'lambda',
          name: 'LAMBDA_TASK',
          taskReferenceName: 'lambda_YGO1',
          inputParameters: {
            lambdaValue: '${workflow.input.lambdaValue}',
            scriptExpression:
              'if ($.lambdaValue == 1) { \n  return { testvalue: true } \n} else { \n  return { testvalue: false } \n}',
          },
          type: 'LAMBDA',
          startDelay: 0,
          optional: false,
          asyncComplete: false,
        },
        isReadOnly: true,
      },
    },
    {
      id: 'end',
      type: 'end',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        label: 'end',
        isReadOnly: true,
      },
    },
  ],
  edges: [
    {
      id: 'estart-lambda_YGO1',
      source: 'start',
      target: 'lambda_YGO1',
      type: 'buttonedge',
    },
    {
      id: 'elambda_YGO1-end',
      source: 'lambda_YGO1',
      target: 'end',
      type: 'buttonedge',
    },
  ],
};

const LAYOUTED_ELEMENTS = {
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        label: 'start',
        isReadOnly: true,
      },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    },
    {
      id: 'lambda_YGO1',
      type: 'base',
      position: {
        x: 0,
        y: 105,
      },
      data: {
        label: 'lambda_YGO1',
        task: {
          id: '6a65a8bc-5e17-4a3b-b4fb-8e90a89b07bc',
          label: 'lambda',
          name: 'LAMBDA_TASK',
          taskReferenceName: 'lambda_YGO1',
          inputParameters: {
            lambdaValue: '${workflow.input.lambdaValue}',
            scriptExpression:
              'if ($.lambdaValue == 1) { \n  return { testvalue: true } \n} else { \n  return { testvalue: false } \n}',
          },
          type: 'LAMBDA',
          startDelay: 0,
          optional: false,
          asyncComplete: false,
        },
        isReadOnly: true,
      },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    },
    {
      id: 'end',
      type: 'end',
      position: {
        x: 0,
        y: 210,
      },
      data: {
        label: 'end',
        isReadOnly: true,
      },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    },
  ],
  edges: [
    {
      id: 'estart-lambda_YGO1',
      source: 'start',
      target: 'lambda_YGO1',
      type: 'buttonedge',
    },
    {
      id: 'elambda_YGO1-end',
      source: 'lambda_YGO1',
      target: 'end',
      type: 'buttonedge',
    },
  ],
};

describe('layouted', () => {
  test('get layouted elements', () => {
    expect(getLayoutedElements(RAW_ELEMENTS, 'TB')).toEqual(LAYOUTED_ELEMENTS);
  });
});
