import { chakra } from '@chakra-ui/react';
import React, { useRef, VoidFunctionComponent } from 'react';
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
        strokeWidth={3}
        stroke="red"
        strokeLinejoin="round"
        fill="red"
        d={getCurvePath(start, end, [])}
        cursor="pointer"
      />
      <G transform={`translate3d(${incomingPosition.x}px, ${incomingPosition.y}px, 0)`} transformOrigin="center center">
        <G transform="translate3d(-18px, -18px, 0) scale(1.5)">
          <path
            d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#000000"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#fff"
          />
        </G>
        <Circle r="12" fillOpacity={0}>
          <title>incoming Laps: {lspCount.incomingLsps}</title>
        </Circle>
        <Text
          height="sm"
          textAnchor="middle"
          y="-20"
          paintOrder="stroke"
          strokeWidth={3}
          stroke="white"
          strokeLinecap="butt"
          strokeLinejoin="round"
        >
          {lspCount.incomingLsps}
        </Text>
      </G>
      <G
        transform={`translate3d(${outcomingPosition.x}px, ${outcomingPosition.y}px, 0)`}
        transformOrigin="center center"
      >
        <G transform="translate3d(-18px, -18px, 0) scale(1.5)">
          <path
            d="M17 12H7M17 12L13 16M17 12L13 8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#000000"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#fff"
          />
        </G>
        <Circle r="12" fillOpacity={0}>
          <title>outcoming Laps: {lspCount.outcomingLsps}</title>
        </Circle>
        <Text
          height="sm"
          textAnchor="middle"
          y="-20"
          paintOrder="stroke"
          strokeWidth={2}
          stroke="white"
          strokeLinecap="butt"
          strokeLinejoin="round"
        >
          {lspCount.outcomingLsps}
        </Text>
      </G>
    </g>
  );
};

export default LspCountItem;
