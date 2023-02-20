import { Box, Theme, useTheme } from '@chakra-ui/react';
import get from 'lodash/get';
import React, { VoidFunctionComponent } from 'react';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { getCurvePath, Line, Position } from '../../pages/topology/graph.helpers';
import { getEdgeColor } from './edge.helpers';

type Props = {
  edge: GraphEdgeWithDiff;
  isActive: boolean;
  isSelected: boolean;
  controlPoints: Position[];
  linePoints: Line;
  onClick: (edge: GraphEdgeWithDiff | null) => void;
  isUnknown: boolean;
};

const Edge: VoidFunctionComponent<Props> = ({
  edge,
  isActive,
  isSelected,
  controlPoints,
  linePoints,
  onClick,
  isUnknown,
}) => {
  const { start, end } = linePoints;
  const { colors } = useTheme<Theme>();

  return (
    <>
      {isActive ? (
        <g>
          <path
            strokeWidth={1}
            stroke={get(colors, getEdgeColor(edge.change, isUnknown))}
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
            pointerEvents={edge.change === 'DELETED' ? 'none' : 'all'}
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
          stroke={getEdgeColor(edge.change, isUnknown)}
          strokeWidth={isActive ? 3 : 1}
          strokeLinecap="round"
          borderWidth={3}
          transition="all .2s ease-in-out"
        />
      )}

      {isSelected && (
        <>
          <defs>
            <path id="sourcePath" d={getCurvePath(start, end, controlPoints)} />
          </defs>
          <text dx={30} dy={20} fontSize={14}>
            <textPath href="#sourcePath">{edge.source.interface}</textPath>
          </text>
          <text dx={-30} dy={-10} fontSize={14}>
            <textPath href="#sourcePath" startOffset="100%" textAnchor="end">
              {edge.target.interface}
            </textPath>
          </text>
        </>
      )}
    </>
  );
};

export default Edge;
