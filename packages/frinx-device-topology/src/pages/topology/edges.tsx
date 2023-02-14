import React, { VoidFunctionComponent } from 'react';
import Edge from '../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { setSelectedEdge } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { getControlPoints, getLinePoints, isTargetingActiveNode } from './graph.helpers';

const EDGE_GAP = 75;

type Props = {
  edgesWithDiff: GraphEdgeWithDiff[];
};

const Edges: VoidFunctionComponent<Props> = ({ edgesWithDiff }) => {
  const { state, dispatch } = useStateContext();
  const { nodePositions, interfaceGroupPositions, connectedNodeIds, selectedNode, selectedEdge, nodes } = state;

  const handleEdgeClick = (edge: GraphEdgeWithDiff | null) => {
    dispatch(setSelectedEdge(edge));
  };

  return (
    <g>
      {edgesWithDiff.map((edge) => {
        // dont show edges that are connected to active node
        // console.log(selectedNode?.device.name, isTargetingActiveNode(edge, selectedNode, interfaceGroupPositions));
        if (isTargetingActiveNode(edge, selectedNode, interfaceGroupPositions)) {
          return null;
        }

        const isActive = !!selectedNode?.interfaces.find((i) => i.id === edge.source.interface);
        const isSelected = edge.id === selectedEdge?.id;

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

        return (
          <Edge
            controlPoints={controlPoints}
            edge={edge}
            isActive={isActive ?? false}
            isSelected={isSelected}
            linePoints={linePoints}
            onClick={handleEdgeClick}
            key={edge.id}
            isUnknown={isUnknown}
          />
        );
      })}
    </g>
  );
};

export default Edges;
