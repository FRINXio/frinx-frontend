import { describe, expect, test } from 'vitest';
import { ExtendedTask } from './workflow-api.types';
import {
  getInitialValuesFromParsedInputParameters,
  isTaskWithInputParameters,
  jsonParse,
  parseInputParameters,
} from './workflow.helpers';

const PARSED_INPUT_PARAMETERS = {
  input1: {
    value: 'test1',
    type: 'number',
    description: 'test1',
  },
  input2: {
    type: 'select',
    value: 'test2',
    description: 'test2',
  },
};

const SUBWORKFLOW_TASK: ExtendedTask = {
  name: 'subworkflow',
  taskReferenceName: 'subworkflow',
  type: 'SUB_WORKFLOW',
  inputParameters: {
    input1: 'input1_value',
    input2: 'input2_value',
  },
  subWorkflowParam: {
    name: 'subworkflow',
    version: 1,
  },
  startDelay: 0,
  optional: false,
  id: 'subworkflow',
  label: 'sub workflow',
};

describe('Test parsing of input parameters of workflow', () => {
  test('test conversion from array of stringified JSONs to one object of all input parameters', () => {
    const inputParameters = [
      '{"input1": {"value": "test1", "type": "number", "description": "test1"}}',
      '{"input2": {"type":"select","value":"test2","description":"test2"}}',
    ];

    expect(parseInputParameters(inputParameters)).toEqual(PARSED_INPUT_PARAMETERS);
  });

  test('test conversion from array of stringified JSONs to one object of all input parameters with null values', () => {
    const inputParameters = [
      '{"input1": {"value": "test1", "type": "number", "description": "test1"}}',
      '{"input2": {"type":"select","value":"test2","description":"test2"}}',
      '{}',
      'JSON with bad format',
    ];

    expect(parseInputParameters(inputParameters)).toEqual(PARSED_INPUT_PARAMETERS);
  });

  test('test conversion from empty array to one object of all input parameters', () => {
    const inputParameters: string[] = [];

    expect(parseInputParameters(inputParameters)).toEqual(null);
  });
});

describe('Test parsing of JSON', () => {
  test('test conversion from stringified JSON to object', () => {
    const json = '{"input1": {"value": "test1", "type": "number", "description": "test1"}}';

    expect(jsonParse(json)).toEqual({
      input1: {
        value: 'test1',
        type: 'number',
        description: 'test1',
      },
    });
  });

  test('test conversion from stringified JSON to object with null value', () => {
    const json = null;

    expect(jsonParse(json)).toEqual(null);
  });

  test('test conversion from stringified JSON to object with bad format', () => {
    const json = 'JSON with bad format';

    expect(jsonParse(json)).toEqual(null);
  });
});

describe('Test making of initial values for formik from parsed and dynamic input parameters of workflow', () => {
  test('test conversion from parsed and dynamic input parameters to one object of all input parameters', () => {
    const dynamicInputParameters = ['input1', 'input2', 'input3'];

    expect(getInitialValuesFromParsedInputParameters(PARSED_INPUT_PARAMETERS, dynamicInputParameters)).toEqual({
      input1: 'test1',
      input2: 'test2',
      input3: '',
    });
  });

  test('test conversion from parsed and dynamic input parameters to one object, where parsed input params are null', () => {
    const parsedInputParameters = null;
    const dynamicInputParameters = ['input1', 'input2', 'input3'];

    expect(getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters)).toEqual({
      input1: '',
      input2: '',
      input3: '',
    });
  });

  test('test conversion from parsed and dynamic input parameters to one object, where dynamic input params are null', () => {
    const dynamicInputParameters = null;

    expect(getInitialValuesFromParsedInputParameters(PARSED_INPUT_PARAMETERS, dynamicInputParameters)).toEqual({
      input1: 'test1',
      input2: 'test2',
    });
  });

  test('test conversion from parsed and dynamic input parameters to one object, where both are null', () => {
    const parsedInputParameters = null;
    const dynamicInputParameters = null;

    expect(getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters)).toEqual({});
  });
});

describe('Subworkflow task assertion from basic Task', () => {
  test('test conversion from Task to SubworkflowTask', () => {
    expect(isTaskWithInputParameters(SUBWORKFLOW_TASK)).toEqual(true);
  });
});
