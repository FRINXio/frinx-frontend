import React, { VoidFunctionComponent } from 'react';
import PtpNodeIcon from '../../../components/node-icons/ptp-node-icon';
import { setSelectedPtpNode, setUnconfimedNodeIdForGmPathSearch } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { PtpGraphNode } from '../../../__generated__/graphql';

type Props = {
  nodes: PtpGraphNode[];
};

const PtpNodes: VoidFunctionComponent<Props> = ({ nodes }) => {
  const { state, dispatch } = useStateContext();
  const {
    ptpNodePositions,
    connectedNodeIds,
    ptpInterfaceGroupPositions,
    mode,
    selectedEdge,
    unconfirmedSelectedGmPathNodeId,
    gmPathIds,
  } = state;

  const handleClick = (node: PtpGraphNode) => {
    if (mode === 'GM_PATH') {
      dispatch(setUnconfimedNodeIdForGmPathSearch(node.id));
    } else {
      dispatch(setSelectedPtpNode(node));
    }
  };

  return (
    <g>
      {nodes.map((node) => (
        <PtpNodeIcon
          onClick={handleClick}
          key={node.id}
          positions={{ nodes: ptpNodePositions, interfaceGroups: ptpInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelectedForGmPath={unconfirmedSelectedGmPathNodeId === node.id}
          isGmPath={gmPathIds.includes(node.nodeId)}
          topologyMode={mode}
          node={node}
          selectedEdge={selectedEdge}
        />
      ))}
    </g>
  );
};

export default PtpNodes;
