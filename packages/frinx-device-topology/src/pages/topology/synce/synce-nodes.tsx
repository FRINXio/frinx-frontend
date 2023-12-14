import React, { VoidFunctionComponent } from 'react';
import PtpNodeIcon from '../../../components/node-icons/ptp-node-icon';
import { useStateContext } from '../../../state.provider';
import { PtpGraphNode } from '../../../__generated__/graphql';

type Props = {
  nodes: PtpGraphNode[];
};

const SynceNodes: VoidFunctionComponent<Props> = ({ nodes }) => {
  const { state } = useStateContext();
  const {
    ptpNodePositions,
    connectedNodeIds,
    ptpInterfaceGroupPositions,
    mode,
    selectedEdge,
    unconfirmedSelectedGmPathNodeId,
    gmPathIds,
  } = state;

  return (
    <g>
      {nodes.map((node) => (
        <PtpNodeIcon
          key={node.id}
          positions={{ nodes: ptpNodePositions, interfaceGroups: ptpInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelectedForGmPath={unconfirmedSelectedGmPathNodeId === node.id}
          isGmPath={gmPathIds.includes(node.nodeId)}
          topologyMode={mode}
          node={node}
          selectedEdge={selectedEdge}
          onPointerDown={() => {}}
          onPointerMove={() => {}}
          onPointerUp={() => {}}
        />
      ))}
    </g>
  );
};

export default SynceNodes;
