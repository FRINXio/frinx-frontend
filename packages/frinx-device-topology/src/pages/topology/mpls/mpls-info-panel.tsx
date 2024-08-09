import { Badge, Box, Button, Divider, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import React, { useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { MplsGraphNode } from '../graph.helpers';
import MplsInfoModal, { DetailMode } from './mpls-info-modal';

type Props = {
  onClose: () => void;
  node: MplsGraphNode;
};

const MplsInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
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
