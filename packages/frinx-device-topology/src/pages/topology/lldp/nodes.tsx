import { unwrap } from '@frinx/shared';
import React, { useState, VoidFunctionComponent } from 'react';
import NodeIcon from '../../../components/node-icons/node-icon';
import { GraphNodeWithDiff } from '../../../helpers/topology-helpers';
import { setSelectedNode, setUnconfirmedSelectedNodeIdsToFindCommonNode } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { ensureNodeHasDevice, GraphNode, Position } from '../graph.helpers';

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
  } = state;
  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });

  const handlePointerDown = (event: React.PointerEvent<SVGRectElement>, node: GraphNode) => {
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
  };
  const handlePointerMove = (event: React.PointerEvent<SVGRectElement>) => {
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
  };
  const handlePointerUp = (node: GraphNodeWithDiff) => {
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
  };

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
        />
      ))}
    </g>
  );
};

export default Nodes;
