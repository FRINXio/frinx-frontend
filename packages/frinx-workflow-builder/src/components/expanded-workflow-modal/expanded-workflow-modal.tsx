import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Workflow, Task, getElementsFromWorkflow, convertTaskToExtendedTask } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import React, { FC, useMemo, useRef, useState } from 'react';
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider } from 'react-flow-renderer';
import { Link } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import { convertWorkflowFragmentToClientWorkflow } from '../../helpers/convert';
import { getLayoutedElements } from '../../helpers/layout.helpers';
import { GetExpandedWorkflowsQuery, GetExpandedWorkflowsQueryVariables } from '../../__generated__/graphql';
import BaseNode from '../workflow-nodes/base-node';
import DecisionNode from '../workflow-nodes/decision-node';
import StartEndNode from '../workflow-nodes/start-end-node';

// TODO; can we somehow reuse WorkflwoFragment from root.tsx?
// app wont build when try to use that one
export const ExpandedWorkflowFragment = gql`
  fragment ExpandedWorkflowFragment on WorkflowDefinition {
    id
    name
    description
    version
    createdAt
    updatedAt
    tasksJson
    hasSchedule
    inputParameters
    outputParameters {
      key
      value
    }
    #restartable
    timeoutSeconds
    #timeoutPolicy
    #ownerEmail
    #variables
  }
`;

const EXPANDED_WORKFLOWS_MODAL = gql`
  query GetExpandedWorkflows($filter: WorkflowsFilterInput) {
    conductor {
      workflowDefinitions(filter: $filter) {
        edges {
          node {
            ...ExpandedWorkflowFragment
          }
        }
      }
    }
  }
  ${ExpandedWorkflowFragment}
`;

const nodeTypes = {
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
  base: BaseNode,
};

type Props = {
  workflowName: string;
  workflowVersion: number;
  onClose: () => void;
};

const ExpandedWorkflowDiagram: FC<{ workflow: Workflow<Task> }> = ({ workflow }) => {
  const elements = getElementsFromWorkflow(workflow.tasks.map(convertTaskToExtendedTask), true);
  const layoutedElements = useMemo(() => getLayoutedElements(elements), [elements]);
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={layoutedElements.nodes}
        edges={layoutedElements.edges}
        nodeTypes={nodeTypes}
        snapToGrid
        onInit={(instance) => instance.fitView()}
      >
        <Background variant={BackgroundVariant.Dots} gap={15} size={0.8} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

const ExpandedWorkflowModal: FC<Props> = ({ workflowName, workflowVersion, onClose }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const [{ data: workflowsData }] = useQuery<GetExpandedWorkflowsQuery, GetExpandedWorkflowsQueryVariables>({
    query: EXPANDED_WORKFLOWS_MODAL,
    variables: {
      filter: {
        keyword: workflowName,
      },
    },
  });

  if (workflowsData?.conductor.workflowDefinitions == null) {
    return null;
  }

  // we got from server all versions with workflowName, so we need filter the one with workflowVersion
  const workflows = workflowsData.conductor.workflowDefinitions.edges
    .filter((e) => e.node.version === workflowVersion)
    .map((e) => convertWorkflowFragmentToClientWorkflow(e.node));

  const [workflow] = workflows;

  return (
    <>
      <Modal isOpen onClose={onClose} size="full" closeOnOverlayClick={false} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{workflow.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="81.97vh">
              <ExpandedWorkflowDiagram workflow={workflow} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FeatherIcon} icon="external-link" size={10} />}
              onClick={() => {
                setIsAlertOpen(true);
              }}
            >
              Edit workflow
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={ref}
        onClose={() => {
          setIsAlertOpen(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Edit workflow</AlertDialogHeader>
            <AlertDialogBody>Are you sure? All unsaved progress on the current workflow will be lost.</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={ref}
                onClick={() => {
                  setIsAlertOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                marginLeft={3}
                as={Link}
                to={`../builder/${workflow.name}/${workflow.version}`}
              >
                Edit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ExpandedWorkflowModal;
