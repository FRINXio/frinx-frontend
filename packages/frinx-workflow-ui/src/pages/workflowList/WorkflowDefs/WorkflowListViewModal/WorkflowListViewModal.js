// @flow
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Icon,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { hash } from '../../../diagramBuilder/builder-utils';
import { jsonParse } from '../../../../common/utils.js';

function createWorkflowTree(tasks, allWorkflows) {
  return tasks.map((task) => {
    return {
      name: task.name,
      taskReferenceName: task.taskReferenceName,
      subWorkflowParam: task?.subWorkflowParam,
      description: jsonParse(task.description)?.description,
      subtasks: getSubTasks(task, allWorkflows),
    };
  });
}

function getSubTasks(task, allWorkflows) {
  if (task.type === 'SUB_WORKFLOW') {
    const subwf = _.find(allWorkflows, { name: task.name });

    // if we can't find subworkflow pass empty array
    return createWorkflowTree(subwf?.tasks || [], allWorkflows);
  }

  if (task.type === 'DECISION') {
    const { decisionCases } = task;
    const nonDefaultCaseNames = Object.keys(decisionCases);

    const decisionBranches = [
      ...nonDefaultCaseNames.map((name) => {
        return {
          name: name,
          tasks: decisionCases[name],
        };
      }),
      {
        name: 'defaultCase',
        tasks: task.defaultCase,
      },
    ];

    return decisionBranches.map((branch) => {
      return {
        name: branch.name,
        // we need to create unique ID to be able to expand/hide the branch in tree
        taskReferenceName: branch.name + hash(),
        subtasks: createWorkflowTree(branch.tasks, allWorkflows),
      };
    });
  }

  if (task.type === 'FORK_JOIN') {
    const { forkTasks } = task;

    return forkTasks.map((branch, i) => {
      return {
        name: `branch ${i}`,
        // we need to create unique ID to be able to expand/hide the branch in tree
        taskReferenceName: `branch ${i}` + hash(),
        subtasks: createWorkflowTree(branch, allWorkflows),
      };
    });
  }

  return [];
}

const WorkflowListViewModal = (props) => {
  const [workflowTree, setWorkflowTree] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState([]);

  useEffect(() => {
    const { tasks } = props.wf;
    const allWorkflows = props.data;
    setWorkflowTree(createWorkflowTree(tasks, allWorkflows));
  }, []);

  function expandHideTask(task) {
    if (expandedTasks.includes(task.taskReferenceName)) {
      setExpandedTasks((oldArray) => oldArray.filter((item) => item !== task.taskReferenceName));
    } else {
      setExpandedTasks((oldArray) => [...oldArray, task.taskReferenceName]);
    }
  }

  function renderExpandButton(task) {
    return (
      <Button size="sm" variant="outline" marginLeft={4} colorScheme="blue" onClick={() => expandHideTask(task)}>
        {expandedTasks.includes(task.taskReferenceName) ? 'Collapse' : 'Expand'}
      </Button>
    );
  }

  function renderHeader(task) {
    const mutedTextStyle = { fontSize: '12px', fontWeight: '400', color: 'grey' };

    if (task.subWorkflowParam) {
      return (
        <p>
          {task.name} <span style={mutedTextStyle}>(workflow)</span>
          {renderExpandButton(task)}
          <Button
            title="Click to open workflow in builder"
            onClick={props.onDefinitionClick(task.subWorkflowParam.name, task.subWorkflowParam.version)}
            basic
            compact
            size="mini"
          >
            <Icon name="external" />
            Edit
          </Button>
        </p>
      );
    }

    return (
      <p>
        {task.name} <span style={mutedTextStyle}>(task)</span>
        {task.subtasks.length > 0 ? renderExpandButton(task) : null}
      </p>
    );
  }

  function renderSubtasks(task) {
    if (task?.subtasks?.length > 0) {
      return (
        <List key={task.taskReferenceName} marginTop={4}>
          <ListItem>
            <Text fontWeight="bold">{renderHeader(task)}</Text>
            <Text>{task?.description}</Text>
            {expandedTasks.includes(task.taskReferenceName) && (
              <List marginLeft={5}>{task.subtasks.map((st) => renderSubtasks(st))}</List>
            )}
          </ListItem>
        </List>
      );
    }

    return (
      <List key={task.taskReferenceName} marginTop={4}>
        <ListItem>
          <Text fontWeight="bold">{renderHeader(task)}</Text>
          <Text>{task?.description}</Text>
        </ListItem>
      </List>
    );
  }

  const renderWorkflowAsTree = () => <List>{workflowTree.map((t) => renderSubtasks(t))}</List>;

  return (
    <Modal size="3xl" isOpen={props.show} onClose={props.modalHandler}>
      <ModalOverlay />
      <ModalCloseButton />

      <ModalContent>
        <ModalHeader>
          {props?.wf?.name}
          <br />
          <div style={{ fontSize: '18px' }}>
            <p className="text-muted">{jsonParse(props?.wf?.description)?.description}</p>
          </div>
        </ModalHeader>

        <ModalBody padding={10}>{renderWorkflowAsTree()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={props.modalHandler}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowListViewModal;
