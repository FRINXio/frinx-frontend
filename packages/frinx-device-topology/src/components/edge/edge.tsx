import { Box, Theme, useTheme } from '@chakra-ui/react';
import get from 'lodash/get';
import React, { VoidFunctionComponent } from 'react';
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
};

const Edge: VoidFunctionComponent<Props> = ({
  edge,
  isActive,
  controlPoints,
  linePoints,
  onClick,
  isUnknown,
  isShortestPath,
}) => {
  const { start, end } = linePoints;
  const { colors } = useTheme<Theme>();

  return isActive ? (
    <g>
      <path
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
    </g>
  ) : (
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
  );
};

export default Edge;
