import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useMutation } from 'urql';
import LabelsFilter from '../../components/labels-filter/labels-filter';
import VersionSelect from '../../components/version-select/version-select';
import StateProvider from '../../state.provider';
import { UpdatePositionMutation, UpdatePositionMutationVariables } from '../../__generated__/graphql';
import { Position } from './graph.helpers';
import TopologyGraph from './topology-graph';

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
  const [, updatePosition] = useMutation<UpdatePositionMutation, UpdatePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const handleNodePositionUpdate = async (positions: { deviceId: string; position: Position }[]) => {
    updatePosition({
      input: positions,
    });
  };

  return (
    <StateProvider>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h1" size="xl">
            Device topology
          </Heading>
        </Flex>
        <Flex gridGap={4}>
          <Box flex={1}>
            <VersionSelect />
          </Box>
          <Box flex={1}>
            <LabelsFilter />
          </Box>
        </Flex>
        <Box>
          <TopologyGraph onNodePositionUpdate={handleNodePositionUpdate} />
        </Box>
      </Container>
    </StateProvider>
  );
};

export default Topology;
