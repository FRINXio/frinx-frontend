import React, { VoidFunctionComponent } from 'react';
import NetNodeIcon from '../../components/net-node-icon/net-node-icon';
import { setSelectedNetNode } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { GraphNetNode } from './graph.helpers';

type Props = {
  nodes: GraphNetNode[];
};

const NetNodes: VoidFunctionComponent<Props> = ({ nodes }) => {
  const { state, dispatch } = useStateContext();
  const {
    netNodePositions,
    connectedNodeIds,
    netInterfaceGroupPositions,
    unconfirmedSelectedNodeIds,
    mode,
    commonNodeIds,
    selectedEdge,
  } = state;

  const handleClick = (node: GraphNetNode) => {
    dispatch(setSelectedNetNode(node));
  };

  return (
    <g>
      {nodes.map((node) => (
        <NetNodeIcon
          onClick={handleClick}
          key={node.id}
          positions={{ nodes: netNodePositions, interfaceGroups: netInterfaceGroupPositions }}
          isFocused={connectedNodeIds.includes(node.name)}
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

export default NetNodes;
