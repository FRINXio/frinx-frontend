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

const DependencyModal = (props) => {
  const createDepTree = (rootWorkflow) => {
    let tree = [];
    let parents = getWorkflowParents(rootWorkflow);
    let rootNode = {
      workflow: rootWorkflow,
      parents,
    };
    tree.push(rootNode);

    let parentStack = [tree[0].parents];
    let currentParents = [];

    while (parentStack.length > 0) {
      currentParents = parentStack.pop();
      currentParents.forEach((wf, i) => {
        let parentsTmp = getWorkflowParents(wf);
        let node = {
          workflow: wf,
          parents: parentsTmp || [],
        };
        currentParents[i] = node;
        parentStack.push(parentsTmp);
      });
    }
    return tree;
  };

  const getWorkflowParents = (workflow) => {
    const usedInWfs = props.data.filter((wf) => {
      let wfJSON = JSON.stringify(wf, null, 2);
      let wfMatch = `"name": "${workflow.name}"`;
      let wfMatchDF = `"expectedName": "${workflow.name}"`;
      return (wfJSON.includes(wfMatch) || wfJSON.includes(wfMatchDF)) && wf.name !== workflow.name;
    });
    return usedInWfs;
  };

  const nestBranch = (wf) => {
    return wf.parents.map((p) => {
      return (
        <TreeNode
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
              onClick={() => props.onDefinitionClick(wf.workflow.name, wf.workflow.version)}
            >
              {p.workflow.name + ' / ' + p.workflow.version}
            </Box>
          }
        >
          {nestBranch(p)}
        </TreeNode>
      );
    });
  };

  const DependencyTree = () => {
    return createDepTree(props.wf).map((wf) => {
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
              onClick={() => props.onDefinitionClick(wf.workflow.name, wf.workflow.version)}
            >
              {wf.workflow.name + ' / ' + wf.workflow.version}
            </Box>
          }
        >
          {nestBranch(wf)}
        </Tree>
      );
    });
  };

  return (
    <Modal size="3xl" isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Workflow Dependency Tree</ModalHeader>
        <ModalBody overflowX="scroll">{DependencyTree()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={props.onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DependencyModal;
