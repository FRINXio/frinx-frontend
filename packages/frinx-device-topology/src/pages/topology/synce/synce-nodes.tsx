import { unwrap } from '@frinx/shared';
import React, { useState, VoidFunctionComponent } from 'react';
import SynceNodeIcon from '../../../components/node-icons/synce-node-icon';
import { getConstrainedPosition, SynceGraphNodeWithDiff } from '../../../helpers/topology-helpers';
import { setSelectedSynceNode, setUnconfimedNodeIdForGmPathSearch } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { Position, SynceGraphNode } from '../graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};

type Props = {
  nodes: SynceGraphNodeWithDiff[];
  onNodePositionUpdate: (deviceName: string, position: Position) => void;
  onNodePositionUpdateFinish: () => void;
};

const SynceNodes: VoidFunctionComponent<Props> = ({ nodes, onNodePositionUpdate, onNodePositionUpdateFinish }) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const { state, dispatch } = useStateContext();
  const {
    synceNodePositions,
    connectedNodeIds,
    synceInterfaceGroupPositions,
    mode,
    selectedEdge,
    unconfirmedSelectedGmPathNodeId,
    gmPathIds,
    selectedNode,
  } = state;

  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });

  const handlePointerDown = (event: React.PointerEvent<SVGRectElement>, node: SynceGraphNode) => {
    if (mode === 'GM_PATH') {
      dispatch(setUnconfimedNodeIdForGmPathSearch(node.id));
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

      const newPosition = getConstrainedPosition(
        {
          x: synceNodePositions[nodeId].x - (position.offset.x - x),
          y: synceNodePositions[nodeId].y - (position.offset.y - y),
        },
        event.currentTarget.viewportElement,
      );

      onNodePositionUpdate(nodeId, newPosition);
    }
  };
  const handlePointerUp = (node: SynceGraphNode) => {
    setIsPointerDown(false);
    if (isMoved) {
      setPosition({
        offset: { x: 0, y: 0 },
        nodeId: null,
        isActive: false,
      });
      onNodePositionUpdateFinish();
    } else {
      dispatch(setSelectedSynceNode(node));
    }
  };

  return (
    <g>
      {nodes.map((node) => (
        <SynceNodeIcon
          key={node.id}
          positions={{ nodes: synceNodePositions, interfaceGroups: synceInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelected={selectedNode?.id === node.id}
          isSelectedForGmPath={unconfirmedSelectedGmPathNodeId === node.id}
          isGmPath={gmPathIds.includes(node.nodeId)}
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

export default SynceNodes;
