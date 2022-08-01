import { readFileSync } from 'fs';
import { assert, describe, test } from 'vitest';
import { getElementsFromWorkflow } from './api-to-graph.helpers';
import { ExtendedTask, Workflow } from './types';

function loadWorkflow(fileName: string): Workflow<ExtendedTask> {
  return JSON.parse(readFileSync(`./src/helpers/workflows/${fileName}`).toString());
}

describe('data helpers', () => {
  test('test decision workflow', () => {
    const decisionWorkflow = loadWorkflow('decision_workflow.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const { nodes, edges } = elements;

    assert.equal(nodes.length, 8);
    assert.equal(edges.length, 9);
    const decisionNode = nodes.find((n) => n.id === 'decision_QUhd');
    assert.isNotNull(decisionNode);
    assert.deepEqual(decisionNode?.data.handles, ['red', 'blue', 'default']);
  });

  test('test decision 2 workflow', () => {
    const decisionWorkflow = loadWorkflow('decision_workflow2.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const { nodes, edges } = elements;

    assert.equal(nodes.length, 6);
    assert.equal(edges.length, 7);
    const decisionNode = nodes.find((n) => n.id === 'decision_ntkF');
    assert.isNotNull(decisionNode);
    assert.deepEqual(decisionNode?.data.handles, ['true', 'default']);
  });

  test('test nested decision workflow', () => {
    const decisionWorkflow = loadWorkflow('nested_decision_workflow.json');
    const elements = getElementsFromWorkflow(decisionWorkflow.tasks, false);
    const { nodes, edges } = elements;

    assert.equal(nodes.length, 12);
    assert.equal(edges.length, 14);
    const decisionNode = nodes.find((n) => n.id === 'decision_QUhd');
    assert.isNotNull(decisionNode);
    assert.deepEqual(decisionNode?.data.handles, ['red', 'blue', 'default']);
  });

  test('test fork workflow', () => {
    const forkWorkflow = loadWorkflow('fork_workflow.json');
    const elements = getElementsFromWorkflow(forkWorkflow.tasks, false);
    const { nodes, edges } = elements;

    assert.equal(nodes.length, 10);
    assert.equal(edges.length, 10);

    const forkEdges = edges.filter((e) => e.source === 'fork_QUhd');
    assert.isNotNull(forkEdges);
    assert.equal(forkEdges.length, 2);

    const joinEdges = edges.filter((e) => e.target === 'join2');
    assert.isNotNull(joinEdges);
    assert.equal(joinEdges.length, 2);
  });

  test('test nested fork workflow', () => {
    const forkWorkflow = loadWorkflow('nested_fork_workflow.json');
    const elements = getElementsFromWorkflow(forkWorkflow.tasks, false);
    const { nodes, edges } = elements;

    assert.equal(nodes.length, 14);
    assert.equal(edges.length, 15);

    const forkEdges = edges.filter((e) => e.source === 'fork_QUhd');
    assert.isNotNull(forkEdges);
    assert.equal(forkEdges.length, 2);

    const joinEdges = edges.filter((e) => e.target === 'join2');
    assert.isNotNull(joinEdges);
    assert.equal(joinEdges.length, 2);
  });

  test('test uni_tx_start workflow', () => {
    const forkWorkflow = loadWorkflow('uni_tx_start_workflow.json');
    const elements = getElementsFromWorkflow(forkWorkflow.tasks, false);
    const { nodes, edges } = elements;

    assert.equal(nodes.length, 6);
    assert.equal(edges.length, 7);

    const decisionNode = nodes.find((n) => n.id === 'should_reuse_parent_tx');
    assert.isNotNull(decisionNode);
    assert.deepEqual(decisionNode?.data.handles, ['False', 'True', 'default']);
  });
});
