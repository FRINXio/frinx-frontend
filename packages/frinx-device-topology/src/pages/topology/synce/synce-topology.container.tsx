import React, { useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation } from 'urql';
import { getSynceNodesAndEdges } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { UpdateSyncePositionMutation, UpdateSyncePositionMutationVariables } from '../../../__generated__/graphql';
import { height, Position, width } from '../graph.helpers';
import SynceTopologyGraph from './synce-topology-graph';

const UPDATE_POSITION_MUTATION = gql`
  mutation UpdateSyncePosition($input: UpdateGraphNodeCoordinatesInput!) {
    deviceInventory {
      updateGraphNodeCoordinates(input: $input) {
        deviceNames
      }
    }
  }
`;

const SynceTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const { topologyLayer } = state;

  const [, updatePosition] = useMutation<UpdateSyncePositionMutation, UpdateSyncePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      dispatch(getSynceNodesAndEdges(client));
    }, 10000);
    dispatch(getSynceNodesAndEdges(client));

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, topologyLayer]);

  const handleNodePositionUpdate = async (positions: { deviceName: string; position: Position }[]) => {
    const coordinates = [
      ...new Set(
        positions.map((p) => ({ deviceName: p.deviceName, x: p.position.x / width, y: p.position.y / height })),
      ),
    ];
    updatePosition({
      input: {
        coordinates,
        layer: 'PtpTopology',
      },
    });
  };

  return <SynceTopologyGraph onNodePositionUpdate={handleNodePositionUpdate} />;
};

export default SynceTopologyContainer;
