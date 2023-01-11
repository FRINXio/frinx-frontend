import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useCallback, useEffect, VoidFunctionComponent } from 'react';
import { gql, useMutation } from 'urql';
import LabelsFilter from '../../components/labels-filter/labels-filter';
import VersionSelect from '../../components/version-select/version-select';
import { setMode } from '../../state.actions';
import { useStateContext } from '../../state.provider';
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

const TopologyContainer: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { mode } = state;
  const [, updatePosition] = useMutation<UpdatePositionMutation, UpdatePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const handleNodePositionUpdate = async (positions: { deviceId: string; position: Position }[]) => {
    updatePosition({
      input: positions,
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const { code } = event;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        dispatch(setMode('COMMON_NODES'));
      }
    },
    [dispatch],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent): void => {
      const { code } = event;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        dispatch(setMode('NORMAL'));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <Container maxWidth={1280} cursor={mode === 'NORMAL' ? 'default' : 'not-allowed'}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Device topology
        </Heading>
      </Flex>
      <Flex gridGap={4}>
        <Box flex={1} paddingBottom="24px">
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
  );
};

export default TopologyContainer;
