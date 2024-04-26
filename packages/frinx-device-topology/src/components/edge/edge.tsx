import { chakra, Box, Theme, useTheme } from '@chakra-ui/react';
import get from 'lodash/get';
import React, { useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { getCurvePath, Line, Position, GraphNetNode } from '../../pages/topology/graph.helpers';
import { getEdgeColor, findCommonNetSubnet, getNetSubnetCoordinates } from './edge.helpers';
import { useStateContext } from '../../state.provider';

type Props = {
  edge: GraphEdgeWithDiff;
  isActive: boolean;
  controlPoints: Position[];
  linePoints: Line;
  onClick: (edge: GraphEdgeWithDiff | null) => void;
  isUnknown: boolean;
  isShortestPath: boolean;
  isWeightVisible?: boolean;
  isGmPath?: boolean;
  weight: number | null;
  netNodes?: GraphNetNode[];
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const Edge: VoidFunctionComponent<Props> = ({
  netNodes,
  edge,
  isActive,
  controlPoints,
  linePoints,
  onClick,
  isUnknown,
  isShortestPath,
  isWeightVisible,
  isGmPath,
  weight,
}) => {
  const { state } = useStateContext();
  const { selectedEdge } = state;
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

  const subnetCoordinates = getNetSubnetCoordinates(netNodes || [], edge);
  const subnetValue = findCommonNetSubnet(netNodes || [], edge);
  const isSelectedEdge = selectedEdge?.id === edge.id;

  return isActive ? (
    <g>
      <path
        ref={edgeRef}
        strokeWidth={1}
        stroke={get(colors, getEdgeColor(edge.change, isUnknown, isShortestPath, isGmPath ?? false))}
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
          <Circle
            r="15"
            fill="white"
            strokeWidth={2}
            stroke={getEdgeColor(edge.change, isUnknown, isShortestPath, false)}
          />
          <Text textAnchor="middle" y="5">
            {weight}
          </Text>
        </G>
      )}
    </g>
  ) : (
    <g>
      <Box
        as="line"
        cursor="pointer"
        onClick={() => {
          onClick(edge);
        }}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={getEdgeColor(edge.change, isUnknown, isShortestPath, isGmPath ?? false)}
        strokeWidth={isActive ? 3 : 1}
        strokeLinecap="round"
        borderWidth={3}
        transition="all .2s ease-in-out"
      />
      <Text>{subnetValue}</Text>
      {isWeightVisible && (
        <G
          transform={`translate3d(${(start.x + end.x) / 2}px, ${(start.y + end.y) / 2}px, 0)`}
          transformOrigin="center center"
        >
          <Circle
            r="15"
            x={`${(start.x + end.x) / 2}px`}
            y={`${(start.y + end.y) / 2}px`}
            fill="white"
            strokeWidth={2}
            stroke={getEdgeColor(edge.change, isUnknown, isShortestPath, false)}
          />
          <Text textAnchor="middle" y="5">
            {weight}
          </Text>
        </G>
      )}
      {isSelectedEdge && (
        <G transform={`translate3d(${subnetCoordinates.x}px, ${subnetCoordinates.y}px, 0)`}>
          <Circle r={4} fill="back" transition="all .2s ease-in-out" />
          <Text key={edge.id} transform="translate3d(-45px, -5px, 0)" fontSize={15} bg="red">
            {subnetValue}
          </Text>
        </G>
      )}
    </g>
  );
};

export default Edge;
