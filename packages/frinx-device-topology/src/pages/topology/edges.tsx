import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useStateContext } from '../../state.provider';
import { setSelectedEdge } from '../../state.actions';
import { GraphEdge } from './graph.helpers';

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
        const isClickable = selectedNode?.interfaces.includes(edge.source.interface);
        const isSelected = edge.id === selectedEdge?.id;
        return (
          <React.Fragment key={edge.id}>
            <Box
              as="line"
              x1={sourcePosition.x}
              y1={sourcePosition.y}
              x2={targetPosition.x}
              y2={targetPosition.y}
              stroke="gray.800"
              strokeWidth={isClickable ? 3 : 1}
              strokeLinecap="round"
              borderWidth={3}
              transition="all .2s ease-in-out"
            />
            {isClickable && (
              <Box
                as="line"
                x1={sourcePosition.x}
                y1={sourcePosition.y}
                x2={targetPosition.x}
                y2={targetPosition.y}
                stroke="transparent"
                strokeWidth={30}
                borderWidth={2}
                strokeLinecap="round"
                transition="all .2s ease-in-out"
                cursor="pointer"
                onClick={() => handleEdgeClick(edge)}
              />
            )}

            {isSelected && (
              <>
                <defs>
                  <path
                    id="sourcePath"
                    d={`M${sourcePosition.x},${sourcePosition.y} L${targetPosition.x},${targetPosition.y}`}
                  />
                  {/* <path
                    id={`targetPath`}
                    d={`M${targetPosition.x},${targetPosition.y} L${sourcePosition.x},${sourcePosition.y}`}
                  /> */}
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
