import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import StateProvider from '../../state.provider';
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
        interfaces
      }
      edges {
        id
        source {
          nodeId
          interface
        }
        target {
          nodeId
          interface
        }
      }
    }
  }
`;
const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition($input: [PositionInput!]!) {
    updateDeviceMetadata(input: $input) {
      devices {
        id
        position {
          x
          y
        }
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
    <StateProvider data={{ nodes: data?.topology.nodes ?? [], edges: data?.topology.edges ?? [] }}>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="3xl">
            Device topology
          </Heading>
        </Flex>
        <Box>
          <TopologyGraph onNodePositionUpdate={handleNodePositionUpdate} />
        </Box>
      </Container>
    </StateProvider>
  );
};

export default Topology;
