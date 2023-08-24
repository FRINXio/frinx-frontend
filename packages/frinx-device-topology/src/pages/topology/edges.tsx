import React, { VoidFunctionComponent } from 'react';
import Edge from '../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { setSelectedEdge } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { getControlPoints, getLinePoints, getNameFromNode, isTargetingActiveNode } from './graph.helpers';

const EDGE_GAP = 75;

type Props = {
  edgesWithDiff: GraphEdgeWithDiff[];
};

const Edges: VoidFunctionComponent<Props> = ({ edgesWithDiff }) => {
  const { state, dispatch } = useStateContext();
  const { nodePositions, interfaceGroupPositions, connectedNodeIds, selectedNode, nodes } = state;

  const handleEdgeClick = (edge: GraphEdgeWithDiff | null) => {
    dispatch(setSelectedEdge(edge));
  };

  return (
    <g>
      {edgesWithDiff.map((edge) => {
        // dont show edges that are connected to active node
        if (isTargetingActiveNode(edge, getNameFromNode(selectedNode), interfaceGroupPositions)) {
          return null;
        }

        const isActive = !!selectedNode?.interfaces.find((i) => i.id === edge.source.interface);

        const linePoints = getLinePoints({ edge, connectedNodeIds, nodePositions, interfaceGroupPositions });
        if (!linePoints) {
          return null;
        }
        const { start, end } = linePoints;
        const controlPoints = isActive
          ? getControlPoints({
              edge,
              interfaceGroupPositions,
              sourcePosition: start,
              targetPosition: end,
              edgeGap: EDGE_GAP,
            })
          : [];
        const isUnknown = !!nodes.find(
          (n) =>
            n.interfaces.find((i) => i.id === edge.source.interface || i.id === edge.target.interface)?.status ===
            'unknown',
        );

        const isShortestPath = false;

        return (
          <Edge
            controlPoints={controlPoints}
            edge={edge}
            isActive={isActive ?? false}
            linePoints={linePoints}
            onClick={handleEdgeClick}
            key={edge.id}
            isUnknown={isUnknown}
            isShortestPath={isShortestPath}
            weight={null}
          />
        );
      })}
    </g>
  );
};

export default Edges;
