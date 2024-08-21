import React, { VoidFunctionComponent } from 'react';
import { GraphEdgeWithDiff } from '../../../helpers/topology-helpers';
import { useStateContext } from '../../../state.provider';
import { getLinePoints, getNameFromNode, isTargetingActiveNode, LspCount } from '../graph.helpers';
import LspCountItem from './lsp-count-item';

type Props = {
  edges: GraphEdgeWithDiff[];
  lspCounts: LspCount[];
};

const LspCounts: VoidFunctionComponent<Props> = ({ edges, lspCounts }) => {
  const { state } = useStateContext();
  const {
    connectedNodeIds,
    selectedNode,
    mplsNodePositions: nodePositions,
    mplsInterfaceGroupPositions: interfaceGroupPositions,
  } = state;

  const activeEdges = edges.filter((e) =>
    isTargetingActiveNode(e, getNameFromNode(selectedNode), interfaceGroupPositions),
  );

  const lspCountsMap = new Map(lspCounts.map((c) => [c.deviceName, c]));

  return (
    <g>
      {activeEdges.map((edge) => {
        const linePoints = getLinePoints({
          edge,
          connectedNodeIds,
          nodePositions,
          interfaceGroupPositions,
        });

        const lspCount = lspCountsMap.get(edge.source.nodeId) ?? null;
        if (!linePoints || !lspCount) {
          return null;
        }

        return <LspCountItem key={`lsp-count-item-${edge.id}`} linePoints={linePoints} lspCount={lspCount} />;
      })}
    </g>
  );
};

export default LspCounts;
