import { unwrap } from '@frinx/shared';
import React, { useState, VoidFunctionComponent } from 'react';
import MplsNodeIcon from '../../../components/node-icons/mpls-node-icon';
import { MplsGraphNodeWithDiff } from '../../../helpers/topology-helpers';
import { setSelectedMplsNode, setUnconfimedNodeIdForLspPathSearch } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { Position, MplsGraphNode } from '../graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};

type Props = {
  nodes: MplsGraphNodeWithDiff[];
  onNodePositionUpdate: (deviceName: string, position: Position) => void;
  onNodePositionUpdateFinish: () => void;
};

const MplsNodes: VoidFunctionComponent<Props> = ({ nodes, onNodePositionUpdate, onNodePositionUpdateFinish }) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const { state, dispatch } = useStateContext();
  const {
    mplsNodePositions,
    connectedNodeIds,
    mplsInterfaceGroupPositions,
    mode,
    selectedEdge,
    unconfirmedSelectedLspPathNodeId,
    lspPathIds,
    selectedNode,
  } = state;

  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });

  const handlePointerDown = (event: React.PointerEvent<SVGRectElement>, node: MplsGraphNode) => {
    if (mode === 'LSP_PATH') {
      dispatch(setUnconfimedNodeIdForLspPathSearch(node.id, null));
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
      setIsMoved(true);
      const bbox = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bbox.left;
      const y = event.clientY - bbox.top;
      const nodeId = unwrap(position.nodeId);
      const newX = mplsNodePositions[nodeId].x - (position.offset.x - x);
      const newY = mplsNodePositions[nodeId].y - (position.offset.y - y);
      onNodePositionUpdate(nodeId, { x: newX, y: newY });
    }
  };
  const handlePointerUp = (node: MplsGraphNode) => {
    setIsPointerDown(false);
    if (isMoved) {
      setPosition({
        offset: { x: 0, y: 0 },
        nodeId: null,
        isActive: false,
      });
      onNodePositionUpdateFinish();
    } else {
      dispatch(setSelectedMplsNode(node));
    }
  };

  return (
    <g>
      {nodes.map((node) => (
        <MplsNodeIcon
          key={node.id}
          positions={{ nodes: mplsNodePositions, interfaceGroups: mplsInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelected={selectedNode?.id === node.id}
          isSelectedForGmPath={unconfirmedSelectedLspPathNodeId === node.id}
          isLspPath={lspPathIds.includes(node.nodeId)}
          topologyMode={mode}
          node={node}
          selectedEdge={selectedEdge}
          selectedNode={selectedNode}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            handlePointerUp(node);
          }}
          onPointerDown={(event) => {
            handlePointerDown(event, node);
          }}
        />
      ))}
    </g>
  );
};

export default MplsNodes;
