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
import { Link } from 'react-router-dom';
import { Workflow } from '../../helpers/types';

type ModalProps = {
  isOpen: boolean;
  workflow?: Workflow;
  workflows: Workflow[];
  onClose: () => void;
};

const nestBranch = (wfs: Workflow[], workflowName = '') => {
  const leafNodes = wfs.filter(({ tasks }) => tasks.some((task) => JSON.stringify(task).includes(workflowName)));

  if (leafNodes.length === 0) {
    return null;
  }

  const workflowsWithoutLeafNodes = wfs.filter((wf) => !leafNodes.map((node) => node.name).includes(wf.name));

  return leafNodes.map(({ name, version }) => (
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
          to={`../builder/${name}/${version}`}
        >
          {`${name} / ${version}`}
        </Box>
      }
    >
      {nestBranch(workflowsWithoutLeafNodes, name)}
    </TreeNode>
  ));
};

function DependencyTree({ workflow, workflows }: { workflow: Workflow; workflows: Workflow[] }) {
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
          to={`../builder/${workflow?.name}/${workflow?.version}`}
        >
          {`${workflow?.name} / ${workflow?.version}`}
        </Box>
      }
    >
      {nestBranch(workflows, workflow?.name)}
    </Tree>
  );
}

function DependencyModal({ workflow, workflows, isOpen, onClose }: ModalProps) {
  if (workflow == null) {
    return null;
  }

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Workflow Dependency Tree</ModalHeader>
        <ModalBody overflowX="scroll">
          <DependencyTree workflow={workflow} workflows={workflows} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DependencyModal;
