import { chakra, Box, Theme, useTheme } from '@chakra-ui/react';
import get from 'lodash/get';
import React, { useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { getCurvePath, Line, Position } from '../../pages/topology/graph.helpers';
import { getEdgeColor } from './edge.helpers';

type Props = {
  edge: GraphEdgeWithDiff;
  isActive: boolean;
  controlPoints: Position[];
  linePoints: Line;
  onClick: (edge: GraphEdgeWithDiff | null) => void;
  isUnknown: boolean;
  isShortestPath: boolean;
  isWeightVisible?: boolean;
};

const G = chakra('g');
const Circle = chakra('circle');

const Edge: VoidFunctionComponent<Props> = ({
  edge,
  isActive,
  controlPoints,
  linePoints,
  onClick,
  isUnknown,
  isShortestPath,
  isWeightVisible,
}) => {
  const { start, end } = linePoints;
  const [weightPosition, setWeightPosition] = useState<Position | null>(null);
  const edgeRef = useRef<SVGPathElement>(null);
  const { colors } = useTheme<Theme>();

  // TODO; maybe instead using svg path arithmetic (this needs one extra render)
  // we can use some proper geometry math to get weight point position
  useEffect(() => {
    if (edgeRef.current && isWeightVisible) {
      const path = edgeRef.current;
      const totalLength = path.getTotalLength();
      const { x, y } = path.getPointAtLength(totalLength / 2);
      setWeightPosition({ x, y });
    } else {
      setWeightPosition(null);
    }
  }, [isActive, isWeightVisible]);

  return isActive ? (
    <g>
      <path
        ref={edgeRef}
        strokeWidth={1}
        stroke={get(colors, getEdgeColor(edge.change, isUnknown, isShortestPath))}
        strokeLinejoin="round"
        fill="none"
        d={getCurvePath(start, end, controlPoints)}
        cursor="pointer"
      />
      <path
        strokeWidth={5}
        stroke="transparent"
        strokeLinejoin="round"
        fill="none"
        d={getCurvePath(start, end, controlPoints)}
        cursor="pointer"
        pointerEvents={edge.change === 'DELETED' ? 'none' : 'stroke'}
        onClick={() => {
          onClick(edge);
        }}
      />
      {isWeightVisible && weightPosition !== null && (
        <G transform={`translate3d(${weightPosition.x}px, ${weightPosition.y}px, 0)`} transformOrigin="center center">
          <Circle r="5" fill="transparent" strokeWidth={3} stroke="blue.500" />
          <Box>11</Box>
        </G>
      )}
    </g>
  ) : (
    <g>
      <Box
        as="line"
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={getEdgeColor(edge.change, isUnknown, isShortestPath)}
        strokeWidth={isActive ? 3 : 1}
        strokeLinecap="round"
        borderWidth={3}
        transition="all .2s ease-in-out"
      />
      {isWeightVisible && (
        <Circle
          transform={`translate3d(${(start.x + end.x) / 2}px, ${(start.y + end.y) / 2}px, 0)`}
          transformOrigin="center center"
          r="5"
          x={`${(start.x + end.x) / 2}px`}
          y={`${(start.y + end.y) / 2}px`}
          fill="transparent"
          strokeWidth={3}
          stroke="blue.500"
        />
      )}
    </g>
  );
};

export default Edge;
