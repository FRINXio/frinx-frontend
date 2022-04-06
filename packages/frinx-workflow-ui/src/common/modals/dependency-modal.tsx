import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Workflow } from '../../helpers/types';
import { Link } from 'react-router-dom';

type ModalProps = {
  isOpen: boolean;
  workflow?: Workflow;
  workflows: Workflow[];
  onClose: () => void;
};

const DependencyModal = ({ workflow, workflows, isOpen, onClose }: ModalProps) => {
  if (workflow == null) {
    return null;
  }

  const nestBranch = (workflowName: string, workflows: Workflow[]) => {
    const leafNodes = workflows.filter(({ tasks }) =>
      tasks.some((task) => {
        return JSON.stringify(task).includes(workflowName);
      }),
    );

    if (leafNodes.length === 0) {
      return null;
    }

    const workflowsWithoutLeafNodes = workflows.filter(
      (workflow) => !leafNodes.map((node) => node.name).includes(workflow.name),
    );

    return leafNodes.map(({ name, version }) => {
      return (
        <TreeNode
          key={name + version}
          label={
            <Box
              display="inline-block"
              borderWidth={1}
              borderColor="gray.200"
              padding={5}
              rounded="md"
              cursor="pointer"
              _hover={{
                backgroundColor: 'gray.100',
              }}
              title="Edit"
              as={Link}
              to={`/uniflow/builder/${name}/${version}`}
            >
              {name + ' / ' + version}
            </Box>
          }
        >
          {nestBranch(name, workflowsWithoutLeafNodes)}
        </TreeNode>
      );
    });
  };

  const DependencyTree = () => {
    return (
      <Tree
        label={
          <Box
            display="inline-block"
            borderWidth={2}
            borderColor="gray.200"
            padding={5}
            rounded="md"
            cursor="pointer"
            _hover={{
              backgroundColor: 'gray.100',
            }}
            title="Edit"
            as={Link}
            to={`uniflow/builder/${workflow.name}/${workflow.version}`}
          >
            {workflow.name + ' / ' + workflow.version}
          </Box>
        }
      >
        {nestBranch(workflow.name, workflows)}
      </Tree>
    );
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Workflow Dependency Tree</ModalHeader>
        <ModalBody overflowX="scroll">{DependencyTree()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DependencyModal;
