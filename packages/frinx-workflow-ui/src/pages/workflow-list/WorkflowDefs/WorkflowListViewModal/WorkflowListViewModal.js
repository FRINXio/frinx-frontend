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
  Box,
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

const Header = ({ task, expandedTasks, expandHideTask, onDefinitionClick }) => {
  const mutedTextStyle = { fontSize: '12px', fontWeight: '400', color: 'grey' };

  if (task.subWorkflowParam) {
    return (
      <div>
        {task.name} <span style={mutedTextStyle}>(workflow)</span>
        <Button size="sm" variant="outline" marginX={4} colorScheme="blue" onClick={() => expandHideTask(task)}>
          {expandedTasks.includes(task.taskReferenceName) ? 'Collapse' : 'Expand'}
        </Button>
        <Button
          title="Click to open workflow in builder"
          onClick={() => onDefinitionClick(task.subWorkflowParam.name, task.subWorkflowParam.version)}
          size="xs"
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div>
      {task.name} <span style={mutedTextStyle}>(task)</span>
      {task.subtasks.length > 0 ? (
        <Button size="sm" variant="outline" marginLeft={4} colorScheme="blue" onClick={() => expandHideTask(task)}>
          {expandedTasks.includes(task.taskReferenceName) ? 'Collapse' : 'Expand'}
        </Button>
      ) : null}
    </div>
  );
};

const SubTasks = ({ expandHideTask, onDefinitionClick, expandedTasks, task }) => {
  if (task?.subtasks?.length > 0) {
    return (
      <ListItem marginY={4}>
        <Box fontWeight="bold">
          <Header
            task={task}
            expandHideTask={expandHideTask}
            onDefinitionClick={onDefinitionClick}
            expandedTasks={expandedTasks}
          />
        </Box>
        <Text>{task?.description}</Text>
        {expandedTasks.includes(task.taskReferenceName) && (
          <List marginLeft={5}>
            {task.subtasks.map((st) => (
              <SubTasks
                key={st.taskReferenceName}
                task={st}
                expandHideTask={expandHideTask}
                onDefinitionClick={onDefinitionClick}
                expandedTasks={expandedTasks}
              />
            ))}
          </List>
        )}
      </ListItem>
    );
  }

  return (
    <ListItem marginY={4}>
      <Box fontWeight="bold">
        <Header
          task={task}
          expandHideTask={expandHideTask}
          onDefinitionClick={onDefinitionClick}
          expandedTasks={expandedTasks}
        />
      </Box>
      <Text>{task?.description}</Text>
    </ListItem>
  );
};

const WorkflowListViewModal = (props) => {
  const [expandedTasks, setExpandedTasks] = useState([]);
  const workflowTree = createWorkflowTree(props.wf.tasks, props.data);

  function expandHideTask(task) {
    if (expandedTasks.includes(task.taskReferenceName)) {
      setExpandedTasks((oldArray) => oldArray.filter((item) => item !== task.taskReferenceName));
    } else {
      setExpandedTasks((oldArray) => [...oldArray, task.taskReferenceName]);
    }
  }

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

        <ModalBody padding={10}>
          <List>
            {workflowTree.map((tsk) => (
              <SubTasks
                key={tsk.taskReferenceName}
                task={tsk}
                expandHideTask={expandHideTask}
                onDefinitionClick={props.onDefinitionClick}
                expandedTasks={expandedTasks}
              />
            ))}
          </List>
        </ModalBody>
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
