import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  TopologyQuery,
  TopologyQueryVariables,
  UpdatePositionMutation,
  UpdatePositionMutationVariables,
} from '../../__generated__/graphql';
import { Position } from './graph.helpers';
import TopologyGraph from './topology-graph';

const TOPOLOGY_QUERY = gql`
  query Topology {
    topology {
      nodes {
        id
        device {
          id
          name
          position {
            x
            y
          }
        }
      }
      edges {
        id
        source
        target
      }
    }
  }
`;
const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition($input: [PositionInput!]!) {
    updateDeviceMetadata(input: $input) {
      devices {
        id
      }
    }
  }
`;

const Topology: VoidFunctionComponent = () => {
  const [{ data, fetching, error }] = useQuery<TopologyQuery, TopologyQueryVariables>({ query: TOPOLOGY_QUERY });
  const [, updatePosition] = useMutation<UpdatePositionMutation, UpdatePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  if (fetching || error) {
    return null;
  }

  const handleNodePositionUpdate = async (positions: { deviceId: string; position: Position }[]) => {
    updatePosition({
      input: positions,
    });
  };

  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Device topology
        </Heading>
      </Flex>
      <Box>
        <TopologyGraph
          data={{ nodes: data?.topology.nodes ?? [], edges: data?.topology.edges ?? [] }}
          onNodePositionUpdate={handleNodePositionUpdate}
        />
      </Box>
    </Container>
  );
};

export default Topology;
