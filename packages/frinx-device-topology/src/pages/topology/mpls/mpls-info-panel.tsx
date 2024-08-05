import { Badge, Box, Button, Divider, Flex, Heading, HStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphMplsNodeInterface, MplsGraphNode } from '../graph.helpers';

type Props = {
  onClose: () => void;
  node: MplsGraphNode;
};

const MplsInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const { state, dispatch } = useStateContext();
  const { mplsEdges } = state;

  const { interfaces } = node;

  const handleInterfaceClick = (deviceInterface: GraphMplsNodeInterface) => {
    const [edge] = mplsEdges.filter((e) => e.source.interface.startsWith(deviceInterface.id));
    if (!edge) {
      return;
    }
    dispatch(setSelectedEdge(edge));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <HStack
      position="absolute"
      top={2}
      right={2}
      background="white"
      borderRadius="md"
      paddingX={4}
      paddingY={6}
      boxShadow="md"
      spacing={4}
      alignItems="flex-start"
    >
      <Box>
        <Flex alignItems="center">
          <Heading as="h3" size="sm">
            {node.name}
          </Heading>
          <Badge marginLeft="auto">{node.status}</Badge>
        </Flex>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            Some detail (???)
          </Heading>
          none
        </Box>
        <Divider m={1} />
        <Box mt={2}>
          <Heading as="h4" fontSize="sm">
            Interfaces
          </Heading>

          {interfaces.map((i) => {
            return (
              <Box key={`device-interface-${i.id}`} my={2}>
                <Button as={Link} onClick={() => handleInterfaceClick(i)} variant="link">
                  {i.name}
                </Button>
              </Box>
            );
          })}
        </Box>
        <HStack spacing={2} marginTop={4}>
          <Button size="sm" onClick={handleClose}>
            Close
          </Button>
        </HStack>
      </Box>
    </HStack>
  );
};

export default MplsInfoPanel;
