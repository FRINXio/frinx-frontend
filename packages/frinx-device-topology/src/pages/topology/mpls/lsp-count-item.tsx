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
  Line,
  LspCount,
  Position,
} from '../graph.helpers';
import MplsEdge from './mpls-edge';

const EDGE_GAP = 75;
const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

type Props = {
  edge: GraphEdgeWithDiff;
  lspCounts: LspCount[];
  linePoints: Line;
};

const LspCountItem: VoidFunctionComponent<Props> = ({ edge, linePoints, lspCounts }) => {
  const edgeRef = useRef<SVGPathElement>(null);
  // const [incomingPosition, setIncomingPosition] = useState<Position | null>(null);
  // const [outcomingPosition, setOutcomingPosition] = useState<Position | null>(null);
  const { state, dispatch } = useStateContext();
  const { selectedNode } = state;

  const { start, end } = linePoints;

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

  function getPointAtLength(line: Line, distance: number): Position {
    const { start, end } = line;
    const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    console.log('length: ', length);
    const x = start.x + (distance / length) * (end.x - start.x);
    const y = start.y + (distance / length) * (end.y - start.y);
    console.log('getPointAtLength: ', line, x, y);
    return {
      x,
      y,
    };
  }

  const incomingPosition = getPointAtLength(linePoints, 0.5);
  // const outcomingPosition = getPointAtLength(linePoints, 0.8);

  return (
    <g>
      <path
        ref={edgeRef}
        strokeWidth={1}
        stroke="red"
        strokeLinejoin="round"
        fill="red"
        d={getCurvePath(start, end, [])}
        cursor="pointer"
      />
      {incomingPosition && (
        <G
          transform={`translate3d(${incomingPosition.x}px, ${incomingPosition.y}px, 0)`}
          transformOrigin="center center"
        >
          <Circle r="15" fill="white" strokeWidth={2} stroke={getEdgeColor('NONE', false, false, false)} />
          <Text textAnchor="middle" y="5">
            i
          </Text>
        </G>
      )}
      {/* {outcomingPosition && (
        <G
          transform={`translate3d(${outcomingPosition.x}px, ${outcomingPosition.y}px, 0)`}
          transformOrigin="center center"
        >
          <Circle r="15" fill="white" strokeWidth={2} stroke={getEdgeColor('NONE', false, false, false)} />
          <Text textAnchor="middle" y="5">
            o
          </Text>
        </G>
      )} */}
    </g>
  );
};

export default LspCountItem;
