import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useStateContext } from '../../state.provider';
import { setSelectedEdge } from '../../state.actions';
import {
  EDGE_SLOPE_RADIUS,
  getDistanceBetweenPoints,
  getDistanceFromLineList,
  getPointOnSlope,
  GraphEdge,
} from './graph.helpers';

const EDGE_GAP = 30;

function getInterfaceGroupName(sourceId: string, targetId: string) {
  return `${sourceId},${targetId}`;
}

const Edges: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { edges, nodePositions, interfaceGroupPositions, connectedNodeIds, selectedNode, selectedEdge } = state;

  const handleEdgeClick = (edge: GraphEdge | null) => {
    dispatch(setSelectedEdge(edge));
  };

  return (
    <g>
      {edges.map((edge) => {
        const sourcePosition = connectedNodeIds.includes(edge.source.nodeId)
          ? interfaceGroupPositions[getInterfaceGroupName(edge.source.nodeId, edge.target.nodeId)].position
          : nodePositions[edge.source.nodeId];
        const targetPosition = connectedNodeIds.includes(edge.target.nodeId)
          ? interfaceGroupPositions[getInterfaceGroupName(edge.target.nodeId, edge.source.nodeId)].position
          : nodePositions[edge.target.nodeId];
        const isActive = selectedNode?.interfaces.includes(edge.source.interface);
        const isSelected = edge.id === selectedEdge?.id;

        const innerPositionList = [];

        if (isActive) {
          const groupName = getInterfaceGroupName(edge.target.nodeId, edge.source.nodeId);
          const groupData = interfaceGroupPositions[groupName];
          const distanceFromLineList = getDistanceFromLineList(groupData.interfaces);
          const index = groupData.interfaces.indexOf(edge.target.interface);
          const length = EDGE_GAP * distanceFromLineList[index];
          const sourceInterfacePosition = getPointOnSlope(sourcePosition, targetPosition, EDGE_SLOPE_RADIUS, length);
          innerPositionList.push(sourceInterfacePosition);
          const positionDistance = getDistanceBetweenPoints(sourcePosition, targetPosition) - EDGE_SLOPE_RADIUS;
          const targetInterfacePosition = getPointOnSlope(sourcePosition, targetPosition, positionDistance, length);
          innerPositionList.push(targetInterfacePosition);
        } else {
          // dont show edges that are connected to active node
          const targetNodeId = edge.target.nodeId;
          const targetGroupName = getInterfaceGroupName(edge.source.nodeId, edge.target.nodeId);
          const targetGroup = interfaceGroupPositions[targetGroupName];
          if (targetNodeId === selectedNode?.device.name && targetGroup.interfaces.includes(edge.source.interface)) {
            return null;
          }
        }

        return (
          <React.Fragment key={edge.id}>
            {isActive ? (
              <polyline
                strokeWidth={1}
                stroke="black"
                strokeLinejoin="round"
                fill="transparent"
                points={`${sourcePosition.x},${sourcePosition.y} ${innerPositionList.map((p) => `${p.x},${p.y}`)} ${
                  targetPosition.x
                },${targetPosition.y}`}
                cursor="pointer"
                onClick={() => handleEdgeClick(edge)}
              />
            ) : (
              <Box
                as="line"
                x1={sourcePosition.x}
                y1={sourcePosition.y}
                x2={targetPosition.x}
                y2={targetPosition.y}
                stroke="gray.800"
                strokeWidth={isActive ? 3 : 1}
                strokeLinecap="round"
                borderWidth={3}
                transition="all .2s ease-in-out"
              />
            )}

            {isSelected && (
              <>
                <defs>
                  <path
                    id="sourcePath"
                    d={`M${innerPositionList[0].x},${innerPositionList[0].y}  L${innerPositionList[1].x},${innerPositionList[1].y}`}
                  />
                </defs>
                <text dx={10} dy={20}>
                  <textPath href="#sourcePath">{edge.source.interface}</textPath>
                </text>
                <text dx={-10} dy={-10}>
                  <textPath href="#sourcePath" startOffset="100%" textAnchor="end">
                    {edge.target.interface}
                  </textPath>
                </text>
              </>
            )}
          </React.Fragment>
        );
      })}
    </g>
  );
};

export default Edges;
