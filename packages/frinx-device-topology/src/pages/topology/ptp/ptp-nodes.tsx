import unwrap from '@frinx/shared/src/helpers/unwrap';
import React, { useState, VoidFunctionComponent } from 'react';
import PtpNodeIcon from '../../../components/node-icons/ptp-node-icon';
import { PtpGraphNodeWithDiff } from '../../../helpers/topology-helpers';
import { setSelectedPtpNode, setUnconfimedNodeIdForGmPathSearch } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { PtpGraphNode } from '../../../__generated__/graphql';
import { Position } from '../graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};

type Props = {
  nodes: PtpGraphNodeWithDiff[];
  ptpDiffSynceIds: string[];
  isPtpDiffSynceShown: boolean;
  onNodePositionUpdate: (deviceName: string, position: Position) => void;
  onNodePositionUpdateFinish: () => void;
};

const PtpNodes: VoidFunctionComponent<Props> = ({
  nodes,
  onNodePositionUpdate,
  onNodePositionUpdateFinish,
  ptpDiffSynceIds,
  isPtpDiffSynceShown,
}) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const { state, dispatch } = useStateContext();
  const {
    ptpNodePositions,
    connectedNodeIds,
    ptpInterfaceGroupPositions,
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

  const handlePointerDown = (event: React.PointerEvent<SVGRectElement>, node: PtpGraphNode) => {
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
      const newX = ptpNodePositions[nodeId].x - (position.offset.x - x);
      const newY = ptpNodePositions[nodeId].y - (position.offset.y - y);
      onNodePositionUpdate(nodeId, { x: newX, y: newY });
    }
  };
  const handlePointerUp = (node: PtpGraphNode) => {
    setIsPointerDown(false);
    if (isMoved) {
      setPosition({
        offset: { x: 0, y: 0 },
        nodeId: null,
        isActive: false,
      });
      onNodePositionUpdateFinish();
    } else {
      dispatch(setSelectedPtpNode(node));
    }
  };

  return (
    <g>
      {nodes.map((node) => (
        <PtpNodeIcon
          ptpDiffSynceIds={ptpDiffSynceIds}
          isPtpDiffSynceShown={isPtpDiffSynceShown}
          key={node.id}
          positions={{ nodes: ptpNodePositions, interfaceGroups: ptpInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelected={selectedNode?.id === node.id}
          isSelectedForGmPath={unconfirmedSelectedGmPathNodeId === node.id}
          isGmPath={gmPathIds.includes(node.nodeId)}
          topologyMode={mode}
          node={node}
          selectedEdge={selectedEdge}
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

export default PtpNodes;
