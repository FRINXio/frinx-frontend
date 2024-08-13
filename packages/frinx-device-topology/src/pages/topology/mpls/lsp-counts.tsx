import { chakra } from '@chakra-ui/react';
import { partition } from 'lodash';
import React, { useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import { getEdgeColor } from '../../../components/edge/edge.helpers';
import { getMplsInterfaceNodeColor, GraphEdgeWithDiff } from '../../../helpers/topology-helpers';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  getControlPoints,
  getCurvePath,
  getLinePoints,
  getNameFromNode,
  isGmPathPredicate,
  isTargetingActiveNode,
  LspCount,
  Position,
} from '../graph.helpers';
import LspCountItem from './lsp-count-item';
import MplsEdge from './mpls-edge';

const EDGE_GAP = 75;
const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

type Props = {
  edges: GraphEdgeWithDiff[];
  lspCounts: LspCount[];
};

const LspCounts: VoidFunctionComponent<Props> = ({ edges, lspCounts }) => {
  const edgeRef = useRef<SVGPathElement>(null);
  const [incomingPosition, setIncomingPosition] = useState<Position | null>(null);
  const [outcomingPosition, setOutcomingPosition] = useState<Position | null>(null);
  const { state, dispatch } = useStateContext();
  const {
    // mplsNodes,
    connectedNodeIds,
    selectedNode,
    mplsNodePositions: nodePositions,
    mplsInterfaceGroupPositions: interfaceGroupPositions,
    gmPathIds,
  } = state;

  const [gmEdges, nonGmEdges] = partition(edges, (edge) => isGmPathPredicate(gmPathIds, edge));
  const sortedSynceEdges = [...nonGmEdges, ...gmEdges];

  // useEffect(() => {
  //   console.log(edgeRef);
  //   if (edgeRef.current) {
  //     const path = edgeRef.current;
  //     const totalLength = path.getTotalLength();
  //     console.log('total length: ', totalLength);

  //     const incomingDomPoint = path.getPointAtLength(totalLength / 2);
  //     setIncomingPosition({
  //       x: incomingDomPoint.x,
  //       y: incomingDomPoint.y,
  //     });

  //     const outcomingDomPoint = path.getPointAtLength((totalLength / 4) * 3);
  //     setOutcomingPosition({
  //       x: outcomingDomPoint.x,
  //       y: outcomingDomPoint.y,
  //     });
  //   }
  // }, [selectedNode]);

  console.log('edges: ', edges);
  console.log('lsp counts: ', lspCounts);

  const activeEdges = edges.filter((e) =>
    isTargetingActiveNode(e, getNameFromNode(selectedNode), interfaceGroupPositions),
  );

  console.log('activeEdges: ', activeEdges);

  return (
    <g>
      {activeEdges.map((edge) => {
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
        console.log('path', start, end);

        return (
          <LspCountItem key={`lsp-count-item-${edge.id}`} edge={edge} linePoints={linePoints} lspCounts={lspCounts} />
        );
      })}
    </g>
  );
};

export default LspCounts;
