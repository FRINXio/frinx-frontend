import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { TopologyQuery, TopologyQueryVariables } from '../../__generated__/graphql';
import TopologyGraph from './topology-graph';

const TOPOLOGY_QUERY = gql`
  query Topology {
    topology {
      nodes {
        id
        device {
          id
          name
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

const Topology: VoidFunctionComponent = () => {
  const [{ data, fetching, error }] = useQuery<TopologyQuery, TopologyQueryVariables>({ query: TOPOLOGY_QUERY });

  if (fetching || error) {
    return null;
  }

  const nodes = data?.topology.nodes.map((n) => ({ id: n.id, name: n.device.name })) ?? [];

  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Device topology
        </Heading>
      </Flex>
      <Box>
        <TopologyGraph data={{ nodes, edges: data?.topology.edges ?? [] }} />
      </Box>
    </Container>
  );
};

export default Topology;
