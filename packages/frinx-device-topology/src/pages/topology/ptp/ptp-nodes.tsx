import React, { VoidFunctionComponent } from 'react';
import PtpNodeIcon from '../../../components/node-icons/ptp-node-icon';
import { addRemoveUnconfirmedNodeIdForShortestPath, setSelectedNetNode } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphNetNode } from '../graph.helpers';

type Props = {
  nodes: GraphNetNode[];
};

const PtpNodes: VoidFunctionComponent<Props> = ({ nodes }) => {
  const { state, dispatch } = useStateContext();
  const {
    netNodePositions,
    connectedNodeIds,
    netInterfaceGroupPositions,
    unconfirmedSelectedNodeIds,
    unconfirmedShortestPathNodeIds,
    mode,
    commonNodeIds,
    alternativeShortestPaths,
    selectedAlternativeShortestPathIndex,
    selectedEdge,
  } = state;

  const handleClick = (node: GraphNetNode) => {
    if (mode === 'SHORTEST_PATH') {
      dispatch(addRemoveUnconfirmedNodeIdForShortestPath(node.id));
    } else {
      dispatch(setSelectedNetNode(node));
    }
  };

  const shortestPathInfo = alternativeShortestPaths.at(selectedAlternativeShortestPathIndex);

  return (
    <g>
      {nodes.map((node) => (
        <PtpNodeIcon
          onClick={handleClick}
          key={node.id}
          positions={{ nodes: netNodePositions, interfaceGroups: netInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
          isSelectedForCommonSearch={unconfirmedSelectedNodeIds.includes(node.name)}
          isSelectedForShortestPath={unconfirmedShortestPathNodeIds.includes(node.id)}
          isCommon={commonNodeIds.includes(node.name)}
          isShortestPath={shortestPathInfo?.nodes.map((n) => n.name).includes(node.nodeId) ?? false}
          topologyMode={mode}
          node={node}
          selectedEdge={selectedEdge}
        />
      ))}
    </g>
  );
};

export default PtpNodes;
