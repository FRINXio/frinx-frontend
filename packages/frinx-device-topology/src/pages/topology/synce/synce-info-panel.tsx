import { Badge, Box, Button, Divider, Flex, Heading, HStack, IconButton, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useClient } from 'urql';
import {
  getDeviceMetadata,
  setMapTopologyType,
  setSelectedEdge,
  setSelectedMapDeviceName,
  setTopologyLayer,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphSynceNodeInterface, normalizeNodeInterfaceData, SynceGraphNode } from '../graph.helpers';
import DeviceInfoPanelAdditionalInfo from '../../../components/device-info-panel/device-info-panel-additional-info';

type Props = {
  onClose: () => void;
  node: SynceGraphNode;
};

const SynceInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const [activeInterface, setActiveInterface] = useState<GraphSynceNodeInterface | null>(null);
  const [isShowingAdditionalInfo, setIsShowingAdditionalInfo] = useState(false);
  const { state, dispatch } = useStateContext();
  const { synceEdges, devicesMetadata } = state;
  const { details, interfaces } = node;

  const client = useClient();

  useEffect(() => {
    dispatch(getDeviceMetadata(client, { topologyType: 'ETH_TOPOLOGY' }));
  }, [client, dispatch]);

  const handleInterfaceClick = (deviceInterface: GraphSynceNodeInterface) => {
    const [edge] = synceEdges.filter((e) => e.source.interface.startsWith(deviceInterface.id));
    if (!edge) {
      return;
    }
    dispatch(setSelectedEdge(edge));
    setActiveInterface(deviceInterface);
  };

  const handleClose = () => {
    onClose();
    setActiveInterface(null);
  };

  const handleShowDeviceOnMap = () => {
    dispatch(setTopologyLayer('Map'));
    dispatch(setMapTopologyType('ETH_TOPOLOGY'));
    dispatch(setSelectedMapDeviceName(node.name));
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
              <Box key={`device-interface-${i.id}`} my={2}>
                <Button as={Link} onClick={() => handleInterfaceClick(i)} variant="link">
                  {i.name}
                </Button>
              </Box>
            );
          })}
        </Box>

        <HStack spacing={2} marginTop={4}>
          <Button
            aria-label="show additional"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsShowingAdditionalInfo((prev) => !prev);
            }}
          >
            Additional info
          </Button>
          <IconButton
            size="sm"
            aria-label="Map"
            icon={<Icon as={FeatherIcon} icon="map" size={20} />}
            isDisabled={!devicesMetadata?.find((device) => device.deviceName === node.name)}
            onClick={handleShowDeviceOnMap}
            colorScheme="blue"
          />
          <Button size="sm" onClick={handleClose}>
            Close
          </Button>
        </HStack>
      </Box>
      {isShowingAdditionalInfo && <DeviceInfoPanelAdditionalInfo additionalInfo={details} />}
      {activeInterface && (
        <DeviceInfoPanelAdditionalInfo additionalInfo={normalizeNodeInterfaceData(activeInterface)} />
      )}
    </HStack>
  );
};

export default SynceInfoPanel;
