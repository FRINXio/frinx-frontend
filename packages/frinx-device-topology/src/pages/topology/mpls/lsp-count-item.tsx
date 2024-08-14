import { chakra } from '@chakra-ui/react';
import React, { useRef, VoidFunctionComponent } from 'react';
import { getEdgeColor } from '../../../components/edge/edge.helpers';
import { getCurvePath, getPointAtLength, Line, LspCount } from '../graph.helpers';

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

type Props = {
  lspCount: LspCount;
  linePoints: Line;
};

const LspCountItem: VoidFunctionComponent<Props> = ({ linePoints, lspCount }) => {
  const edgeRef = useRef<SVGPathElement>(null);

  const { start, end } = linePoints;

  const incomingPosition = getPointAtLength(linePoints, 0.3);
  const outcomingPosition = getPointAtLength(linePoints, 0.7);

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
      <G transform={`translate3d(${incomingPosition.x}px, ${incomingPosition.y}px, 0)`} transformOrigin="center center">
        <Circle r="15" fill="white" strokeWidth={2} stroke={getEdgeColor('NONE', false, false, false)} />
        <Text height="sm" textAnchor="middle" y="-20">
          {lspCount.incomingLsps}
        </Text>
      </G>
      <G
        transform={`translate3d(${outcomingPosition.x}px, ${outcomingPosition.y}px, 0)`}
        transformOrigin="center center"
      >
        <Circle r="15" fill="white" strokeWidth={2} stroke={getEdgeColor('NONE', false, false, false)} />
        <Text height="sm" textAnchor="middle" y="-20">
          {lspCount.outcomingLsps}
        </Text>
      </G>
    </g>
  );
};

export default LspCountItem;
