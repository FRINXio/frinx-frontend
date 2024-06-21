import { unwrap, usePerformanceMonitoring } from '@frinx/shared';
import React, { useCallback, useEffect, useState, VoidFunctionComponent } from 'react';
import { gql, useSubscription } from 'urql';
import NodeIcon from '../../../components/node-icons/node-icon';
import { GraphNodeWithDiff } from '../../../helpers/topology-helpers';
import {
  setSelectedNode,
  setSelectedNodeLoad,
  setUnconfirmedSelectedNodeIdsToFindCommonNode,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { SelectedNodeUsageSubscription, SelectedNodeUsageSubscriptionVariables } from '../../../__generated__/graphql';
import { ensureNodeHasDevice, GraphNode, Position } from '../graph.helpers';

const GET_SELECTED_NODE_USAGE_SUBSCRIPTION = gql`
  subscription SelectedNodeUsage($deviceName: String!, $refreshEverySec: Int) {
    deviceInventory {
      deviceUsage(deviceName: $deviceName, refreshEverySec: $refreshEverySec) {
        cpuLoad
        memoryLoad
      }
    }
  }
`;

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};
type Props = {
  nodesWithDiff: GraphNodeWithDiff[];
  onNodePositionUpdate: (deviceName: string, position: Position) => void;
  onNodePositionUpdateFinish: () => void;
};

const Nodes: VoidFunctionComponent<Props> = ({ nodesWithDiff, onNodePositionUpdate, onNodePositionUpdateFinish }) => {
  const { isEnabled: isPerformanceMonitoringEnabled } = usePerformanceMonitoring();
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const { state, dispatch } = useStateContext();
  const {
    nodePositions,
    connectedNodeIds,
    selectedNode,
    interfaceGroupPositions,
    unconfirmedSelectedNodeIds,
    mode,
    commonNodeIds,
    selectedEdge,
    selectedNodeLoad,
  } = state;
  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });

  const [{ data: deviceUsage }] = useSubscription<
    SelectedNodeUsageSubscriptionVariables,
    SelectedNodeUsageSubscription
  >({
    query: GET_SELECTED_NODE_USAGE_SUBSCRIPTION,
    variables: {
      deviceName: selectedNode?.name ?? '',
    },
    pause: selectedNode == null || !isPerformanceMonitoringEnabled,
  });

  useEffect(() => {
    dispatch(setSelectedNodeLoad(selectedNode?.name ?? '', deviceUsage?.deviceInventory?.deviceUsage));
  }, [deviceUsage, dispatch, selectedNode?.name]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGRectElement>, node: GraphNode) => {
      if (mode === 'COMMON_NODES') {
        const newUnconfirmedSelectedNodeIds = unconfirmedSelectedNodeIds.includes(node.name)
          ? unconfirmedSelectedNodeIds.filter((id) => id !== node.name)
          : [...unconfirmedSelectedNodeIds, node.name];
        dispatch(setUnconfirmedSelectedNodeIdsToFindCommonNode(newUnconfirmedSelectedNodeIds));
      } else {
        setIsPointerDown(true);
        setIsMoved(false);
        const element = event.currentTarget;
        const bbox = element.getBoundingClientRect();
        const x = event.clientX - bbox.left;
        const y = event.clientY - bbox.top;
        element.setPointerCapture(event.pointerId);
        setPosition({
          nodeId: node.name,
          isActive: true,
          offset: {
            x,
            y,
          },
        });
      }
    },
    [dispatch, mode, unconfirmedSelectedNodeIds],
  );
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGRectElement>) => {
      if (position.isActive && isPointerDown) {
        // TODO: these prevent fire panning handler
        // we should probably introduce some toolbar where we can switch between
        // pan/zoom/normal mode and use different events based on its state
        event.preventDefault();
        event.stopPropagation();

        setIsMoved(true);
        const bbox = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bbox.left;
        const y = event.clientY - bbox.top;
        const nodeId = unwrap(position.nodeId);
        const newX = nodePositions[nodeId].x - (position.offset.x - x);
        const newY = nodePositions[nodeId].y - (position.offset.y - y);
        onNodePositionUpdate(nodeId, { x: newX, y: newY });
      }
    },
    [
      isPointerDown,
      nodePositions,
      onNodePositionUpdate,
      position.isActive,
      position.nodeId,
      position.offset.x,
      position.offset.y,
    ],
  );
  const handlePointerUp = useCallback(
    (node: GraphNodeWithDiff) => {
      setIsPointerDown(false);
      if (isMoved) {
        setPosition({
          offset: { x: 0, y: 0 },
          nodeId: null,
          isActive: false,
        });
        onNodePositionUpdateFinish();
      } else {
        if (node.change !== 'DELETED') {
          dispatch(setSelectedNode(node));
        }
      }
    },
    [dispatch, isMoved, onNodePositionUpdateFinish],
  );

  return (
    <g>
      {nodesWithDiff.map((node) => (
        <NodeIcon
          key={node.id}
          onPointerDown={(event) => {
            handlePointerDown(event, node);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            handlePointerUp(node);
          }}
          positions={{ nodes: nodePositions, interfaceGroups: interfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelected={ensureNodeHasDevice(selectedNode) && selectedNode.id === node.id}
          isSelectedForCommonSearch={unconfirmedSelectedNodeIds.includes(node.name)}
          isCommon={commonNodeIds.includes(node.name)}
          topologyMode={mode}
          node={node}
          selectedEdge={selectedEdge}
          isShowingLoad={selectedNodeLoad?.deviceName === node.device?.name}
          nodeLoad={selectedNodeLoad.deviceUsage}
          selectedNode={selectedNode}
        />
      ))}
    </g>
  );
};

export default Nodes;
