import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import ServiceTable from './service-table';
import { VpnService } from '../../components/forms/service-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';
import unwrap from '../../helpers/unwrap';

type Props = {
  onCreateVpnServiceClick: () => void;
  onEditVpnServiceClick: (serviceId: string) => void;
};

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onCreateVpnServiceClick, onEditVpnServiceClick }) => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const services = await callbacks.getVpnServices();
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
    };

    fetchData();
  }, []);

  function handleDeleteButtonClick(serviceId: string) {
    setServiceIdToDelete(serviceId);
    deleteModalDisclosure.onOpen();
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          callbackUtils.getCallbacks.deleteVpnService(unwrap(serviceIdToDelete)).then(() => {
            setVpnServices(unwrap(vpnServices).filter((service) => service.vpnId !== serviceIdToDelete));
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete service"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="xl">
            Services
          </Heading>
          <Button colorScheme="blue" onClick={onCreateVpnServiceClick}>
            Add service
          </Button>
        </Flex>
        <Box>
          {vpnServices ? (
            <ServiceTable
              onEditServiceButtonClick={onEditVpnServiceClick}
              onDeleteServiceButtonClick={handleDeleteButtonClick}
              services={vpnServices}
            />
          ) : null}
        </Box>
      </Container>
    </>
  );
};

export default CreateVpnServicePage;
