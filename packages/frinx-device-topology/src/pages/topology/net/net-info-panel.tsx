import { Box, Button, Flex, Heading, HStack, IconButton, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { setMapTopologyType, setSelectedMapDeviceName, setTopologyLayer } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphNetNode } from '../graph.helpers';

type Props = {
  onClose: () => void;
  node: GraphNetNode;
};

const NetInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const { state, dispatch } = useStateContext();
  const { devicesMetadata } = state;

  const handleClose = () => {
    onClose();
  };

  const handleShowDeviceOnMap = () => {
    dispatch(setTopologyLayer('Map'));
    dispatch(setMapTopologyType('NetworkTopology'));
    dispatch(setSelectedMapDeviceName(node.phyDeviceName));
  };

  return (
    <HStack
      position="absolute"
      top={10}
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
        </Flex>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            Show geo-location
          </Heading>
        </Box>
        <HStack spacing={2} marginTop={4}>
          <IconButton
            size="sm"
            aria-label="Map"
            icon={<Icon as={FeatherIcon} icon="map" size={20} />}
            isDisabled={!devicesMetadata?.find((device) => device.deviceName === node.phyDeviceName)}
            onClick={handleShowDeviceOnMap}
            colorScheme="blue"
          />
          <Button size="sm" onClick={handleClose}>
            Close
          </Button>
        </HStack>
      </Box>
    </HStack>
  );
};

export default NetInfoPanel;
