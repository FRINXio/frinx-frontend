import { assert, describe, test } from 'vitest';
import { readFileSync } from 'fs';
import { ExtendedTask, Workflow } from './types';
import { getElementsFromWorkflow } from './api-to-graph.helpers';
import { convertToTasks } from './graph-to-api.helpers';

function loadWorkflow(fileName: string): Workflow<ExtendedTask> {
  return JSON.parse(readFileSync(`./src/helpers/workflows/${fileName}`).toString());
}

describe('api helpers', () => {
  test('decision workflow to api transformation', () => {
    const decisionWorkflow = loadWorkflow('decision_workflow.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const transformedDecisionWorkflow = convertToTasks(elements);
    assert.deepEqual(decisionWorkflow.tasks, transformedDecisionWorkflow);
  });

  test('decision workflow 2 to api transformation', () => {
    const decisionWorkflow = loadWorkflow('decision_workflow2.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const transformedDecisionWorkflow = convertToTasks(elements);
    assert.deepEqual(decisionWorkflow.tasks, transformedDecisionWorkflow);
  });

  test('nested decision workflow to api transformation', () => {
    const decisionWorkflow = loadWorkflow('nested_decision_workflow.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const transformedDecisionWorkflow = convertToTasks(elements);
    assert.deepEqual(decisionWorkflow.tasks, transformedDecisionWorkflow);
  });

  test('fork workflow to api transformation', () => {
    const forkWorkflow = loadWorkflow('fork_workflow.json');
    const elements = getElementsFromWorkflow(forkWorkflow.tasks, false);
    const transformedForkWorkflow = convertToTasks(elements);
    assert.deepEqual(forkWorkflow.tasks, transformedForkWorkflow);
  });

  test('uni_tx_start workflow to api transformation', () => {
    const decisionWorkflow = loadWorkflow('uni_tx_start_workflow.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const transformedDecisionWorkflow = convertToTasks(elements);
    assert.deepEqual(decisionWorkflow.tasks, transformedDecisionWorkflow);
  });
});
