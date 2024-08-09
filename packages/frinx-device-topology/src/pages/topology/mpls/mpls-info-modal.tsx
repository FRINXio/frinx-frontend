import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { MplsGraphNodeDetails } from '../graph.helpers';
import LspTable from './lsp-table';
import MplsTable from './mpls-table';

export type DetailMode = 'mplsData' | 'lspTunnels';

type Props = {
  details: MplsGraphNodeDetails;
  detailMode: DetailMode;
  onClose: () => void;
};

const MplsInfoModal: VoidFunctionComponent<Props> = ({ detailMode, details, onClose }) => {
  const { mplsData, lspTunnels } = details;

  return (
    <Modal closeOnOverlayClick={false} isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent minWidth="fit-content">
        <ModalHeader>{detailMode === 'lspTunnels' ? 'Lsp Tunnels ' : 'Mpls Details'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {detailMode === 'lspTunnels' ? <LspTable data={lspTunnels} /> : <MplsTable data={mplsData} />}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MplsInfoModal;
