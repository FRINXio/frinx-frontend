import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { apiBearerToClientBearer } from '../../components/forms/converters';
import EvcTable from './evc-table';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';

type Props = {
  onCreateEvcClick: (bearerId: string) => void;
  onEditEvcClick: (bearerId: string, evcType: string, circuitReference: string) => void;
  onBearerListClick: () => void;
};

const EvcListPage: VoidFunctionComponent<Props> = ({ onCreateEvcClick, onEditEvcClick, onBearerListClick }) => {
  const [bearer, setBearer] = useState<VpnBearer | null>(null);
  const [evcToDelete, setEvcToDelete] = useState<Pick<EvcAttachment, 'evcType' | 'circuitReference'> | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const { bearerId } = useParams<{ bearerId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiBearers = await callbacks.getVpnBearers();
      const clientVpnBearers = apiBearerToClientBearer(apiBearers);
      const [selectedVpnBearer] = clientVpnBearers.filter((b) => b.spBearerReference === bearerId);
      setBearer(selectedVpnBearer);
    };

    fetchData();
  }, [bearerId]);

  function handleDeleteButtonClick(evcType: string, circuitReference: string) {
    setEvcToDelete({
      evcType,
      circuitReference,
    });
    deleteModalDisclosure.onOpen();
  }

  if (!bearer) {
    return null;
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          const editedVpnBearer: VpnBearer = {
            ...bearer,
            evcAttachments: bearer.evcAttachments.filter(
              (e) => !(e.evcType === evcToDelete?.evcType && e.circuitReference === evcToDelete?.circuitReference),
            ),
          };
          callbackUtils.getCallbacks.editVpnBearer(editedVpnBearer).then(() => {
            setBearer(editedVpnBearer);
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete evc attachment"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Evc Attachments (Bearer: {bearer.spBearerReference})
          </Heading>
          <Button colorScheme="blue" onClick={() => onCreateEvcClick(bearer.spBearerReference)}>
            Add Evc Attachment
          </Button>
        </Flex>
        <Box>
          <EvcTable
            onEditEvcButtonClick={onEditEvcClick}
            onDeleteEvcButtonClick={handleDeleteButtonClick}
            bearer={bearer}
          />
        </Box>
        <Box py={6}>
          <Button onClick={() => onBearerListClick()} colorScheme="blue">
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EvcListPage;
