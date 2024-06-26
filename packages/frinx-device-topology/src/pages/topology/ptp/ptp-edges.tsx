import { partition } from 'lodash';
import React, { VoidFunctionComponent } from 'react';
import PtpEdge from './ptp-edge';
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

const EDGE_GAP = 75;

type Props = {
  edgesWithDiff: GraphEdgeWithDiff[];
};

const PtpEdges: VoidFunctionComponent<Props> = ({ edgesWithDiff: edges }) => {
  const { state, dispatch } = useStateContext();
  const {
    ptpNodes,
    connectedNodeIds,
    selectedNode,
    ptpNodePositions: nodePositions,
    ptpInterfaceGroupPositions: interfaceGroupPositions,
    gmPathIds,
  } = state;

  const handleEdgeClick = (edge: GraphEdgeWithDiff | null) => {
    dispatch(setSelectedEdge(edge));
  };

  const [gmEdges, nonGmEdges] = partition(edges, (edge) => isGmPathPredicate(gmPathIds, edge));
  const sortedPtpEdges = [...nonGmEdges, ...gmEdges];
  const ptpInterfaceMap = new Map(ptpNodes.flatMap((n) => n.interfaces).map((i) => [i.id, i]));

  return (
    <g>
      {sortedPtpEdges.map((edge) => {
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
        const isGmPathEdge =
          gmEdges.findIndex(
            (e) => e.source.interface === edge.source.interface && e.target.interface === edge.target.interface,
          ) > -1;

        return (
          <PtpEdge
            controlPoints={controlPoints}
            ptpInterfaceMap={ptpInterfaceMap}
            edge={edge}
            isActive={isActive ?? false}
            linePoints={linePoints}
            onClick={handleEdgeClick}
            key={edge.id}
            isUnknown={isUnknown}
            isShortestPath={isShortestPath}
            isGmPath={isGmPathEdge}
            weight={null}
          />
        );
      })}
    </g>
  );
};

export default PtpEdges;
