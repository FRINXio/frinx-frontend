import { partition } from 'lodash';
import React, { VoidFunctionComponent } from 'react';
import { GraphEdgeWithDiff } from '../../../helpers/topology-helpers';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  getControlPoints,
  getLinePoints,
  getNameFromNode,
  isGmPathPredicate,
  isTargetingActiveNode,
} from '../graph.helpers';
import MplsEdge from './mpls-edge';

const EDGE_GAP = 75;

type Props = {
  edgesWithDiff: GraphEdgeWithDiff[];
};

const MplsEdges: VoidFunctionComponent<Props> = ({ edgesWithDiff: edges }) => {
  const { state, dispatch } = useStateContext();
  const {
    // mplsNodes,
    connectedNodeIds,
    selectedNode,
    mplsNodePositions: nodePositions,
    mplsInterfaceGroupPositions: interfaceGroupPositions,
    lspPathIds,
  } = state;

  const handleEdgeClick = (edge: GraphEdgeWithDiff | null) => {
    dispatch(setSelectedEdge(edge));
  };

  const [lspEdges, nonLspEdges] = partition(edges, (edge) => isGmPathPredicate(lspPathIds, edge));
  const sortedSynceEdges = [...nonLspEdges, ...lspEdges];

  return (
    <g>
      {sortedSynceEdges.map((edge) => {
        if (isTargetingActiveNode(edge, getNameFromNode(selectedNode), interfaceGroupPositions)) {
          return null;
        }
        const isActive = !!selectedNode?.interfaces.find((i) => i.id === edge.source.interface);
        const linePoints = getLinePoints({
          edge,
          connectedNodeIds,
          nodePositions,
          interfaceGroupPositions,
        });

        if (!linePoints) {
          return null;
        }
        const { start, end } = linePoints;
        const controlPoints = isActive
          ? getControlPoints({
              edge,
              interfaceGroupPositions,
              sourcePosition: start,
              targetPosition: end,
              edgeGap: EDGE_GAP,
            })
          : [];

        const isUnknown = false;
        const isShortestPath = false;
        const isLspPathEdge =
          lspEdges.findIndex(
            (e) => e.source.interface === edge.source.interface && e.target.interface === edge.target.interface,
          ) > -1;

        return (
          <MplsEdge
            controlPoints={controlPoints}
            edge={edge}
            isActive={isActive ?? false}
            linePoints={linePoints}
            onClick={handleEdgeClick}
            key={edge.id}
            isUnknown={isUnknown}
            isShortestPath={isShortestPath}
            isLspPath={isLspPathEdge}
            weight={null}
          />
        );
      })}
    </g>
  );
};

export default MplsEdges;
