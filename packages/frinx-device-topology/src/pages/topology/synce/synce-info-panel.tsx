import { Badge, Box, Button, Divider, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { SynceGraphNode } from '../../../__generated__/graphql';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphNodeInterface } from '../graph.helpers';

type Props = {
  onClose: () => void;
  node: SynceGraphNode;
};

const SynceInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const { state, dispatch } = useStateContext();
  const { synceEdges } = state;
  const { synceDeviceDetails: details, interfaces } = node;

  const handleInterfaceClick = (deviceInterface: GraphNodeInterface) => {
    const [edge] = synceEdges.filter((e) => e.id.startsWith(deviceInterface.id));
    if (!edge) {
      return;
    }
    dispatch(setSelectedEdge(edge));
  };

  return (
    <Box>
      <Flex alignItems="center">
        <Heading as="h3" size="sm">
          {node.name}
        </Heading>
        <Badge marginLeft="auto">{node.status}</Badge>
      </Flex>
      <Box mt={2}>
        <Heading as="h4" fontSize="xs">
          Selected for use
        </Heading>
        {details.selectedForUse}
      </Box>
      <Divider m={1} />
      <Box mt={2}>
        <Heading as="h4" fontSize="sm">
          Interfaces
        </Heading>
        {interfaces.map((i) => {
          return (
            <Box key={`device-interface-${i.id}`}>
              <Button as={Link} onClick={() => handleInterfaceClick(i)}>
                {i.name}
              </Button>
              <Text>{i.status}</Text>
            </Box>
          );
        })}
      </Box>
      <HStack spacing={2} marginTop={4}>
        <Button size="sm" onClick={onClose}>
          Close
        </Button>
      </HStack>
    </Box>
  );
};

export default SynceInfoPanel;
