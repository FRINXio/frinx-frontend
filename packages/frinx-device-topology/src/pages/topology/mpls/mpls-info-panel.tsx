import { Badge, Box, Button, Divider, Flex, Heading, HStack, useDisclosure, IconButton, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { setMapTopologyType, setSelectedMapDeviceName, setTopologyLayer } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { MplsGraphNode } from '../graph.helpers';
import MplsInfoModal, { DetailMode } from './mpls-info-modal';

type Props = {
  onClose: () => void;
  node: MplsGraphNode;
};

const MplsInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const { dispatch, state } = useStateContext();

  const { devicesMetadata } = state;

  const mplsInfoModal = useDisclosure();
  const [detailMode, setDetailMode] = useState<DetailMode>('mplsData');

  const handleMplsOpen = () => {
    setDetailMode('mplsData');
    mplsInfoModal.onOpen();
  };

  const handleLspOpen = () => {
    setDetailMode('lspTunnels');
    mplsInfoModal.onOpen();
  };

  const handleClose = () => {
    onClose();
  };

  const handleShowDeviceOnMap = () => {
    dispatch(setTopologyLayer('Map'));
    dispatch(setMapTopologyType('MplsTopology'));
    dispatch(setSelectedMapDeviceName(node.name));
  };

  return (
    <>
      {mplsInfoModal.isOpen && (
        <MplsInfoModal onClose={mplsInfoModal.onClose} details={node.details} detailMode={detailMode} />
      )}

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
              Mpls detail
            </Heading>
            none
          </Box>
          <Divider m={1} />
          <Box mt={2}>
            <Box my={2}>
              <Button as={Link} size="sm" colorScheme="blue" onClick={handleMplsOpen}>
                MPLS table
              </Button>
            </Box>
            <Box my={2}>
              <Button as={Link} size="sm" colorScheme="blue" onClick={handleLspOpen}>
                LSP table
              </Button>
            </Box>
          </Box>
          <HStack spacing={2} marginTop={4}>
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
      </HStack>
    </>
  );
};

export default MplsInfoPanel;
