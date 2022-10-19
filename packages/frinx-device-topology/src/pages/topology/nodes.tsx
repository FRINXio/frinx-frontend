import { unwrap } from '@frinx/shared/src';
import React, { useRef, useState, VoidFunctionComponent } from 'react';
import NodeIcon from '../../components/node-icon/node-icon';
import { setSelectedNode } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { GraphNode, Position } from './graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};
type Props = {
  onNodePositionUpdate: (nodeId: string, position: Position) => void;
  onNodePositionUpdateFinish: () => void;
};

const Nodes: VoidFunctionComponent<Props> = ({ onNodePositionUpdate, onNodePositionUpdateFinish }) => {
  const { state, dispatch } = useStateContext();
  const { nodes, nodePositions, connectedNodeIds, selectedNode, interfaceGroupPositions } = state;
  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });
  const timeoutRef = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent<SVGRectElement>, node: GraphNode) => {
    timeoutRef.current = Number(
      setTimeout(() => {
        dispatch(setSelectedNode(node));
      }, 250),
    );
    const element = event.currentTarget;
    const bbox = element.getBoundingClientRect();
    const x = event.clientX - bbox.left;
    const y = event.clientY - bbox.top;
    element.setPointerCapture(event.pointerId);
    setPosition({
      nodeId: node.device.name,
      isActive: true,
      offset: {
        x,
        y,
      },
    });
  };
  const handlePointerMove = (event: React.PointerEvent<SVGRectElement>) => {
    if (position.isActive) {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
      const bbox = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bbox.left;
      const y = event.clientY - bbox.top;
      const nodeId = unwrap(position.nodeId);
      const newX = nodePositions[nodeId].x - (position.offset.x - x);
      const newY = nodePositions[nodeId].y - (position.offset.y - y);
      onNodePositionUpdate(nodeId, { x: newX, y: newY });
    }
  };
  const handlePointerUp = () => {
    setPosition({
      offset: { x: 0, y: 0 },
      nodeId: null,
      isActive: false,
    });
    onNodePositionUpdateFinish();
  };

  return (
    <g>
      {nodes.map((node) => (
        <NodeIcon
          key={node.id}
          onPointerDown={(event) => {
            handlePointerDown(event, node);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          positions={{ nodes: nodePositions, interfaceGroups: interfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.device.name)}
          isSelected={selectedNode?.device.id === node.device.id}
          node={node}
        />
      ))}
    </g>
  );
};

export default Nodes;
