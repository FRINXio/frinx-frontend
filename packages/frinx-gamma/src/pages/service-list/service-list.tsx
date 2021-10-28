import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, HStack, Heading, Box, Container, Flex, Button, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import ServiceTable from './service-table';
import { VpnService } from '../../components/forms/service-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';
import unwrap from '../../helpers/unwrap';
import CommitStatusModal from '../../components/commit-status-modal/commit-status-modal';

type Props = {
  onCreateVpnServiceClick: () => void;
  onEditVpnServiceClick: (serviceId: string) => void;
};

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onCreateVpnServiceClick, onEditVpnServiceClick }) => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
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

  function handleCommitBtnClick() {
    const callbacks = callbackUtils.getCallbacks;
    callbacks
      .executeWorkflow({
        name: 'Render_all',
        version: 1,
      })
      .then((data) => {
        setWorkflowId(data.text);
      });
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
      {workflowId != null && (
        <CommitStatusModal
          workflowId={workflowId}
          isOpen
          onClose={() => {
            setWorkflowId(null);
          }}
        />
      )}
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            VPN Services
          </Heading>
          <HStack>
            <Button variant="outline" colorScheme="blue" onClick={handleCommitBtnClick}>
              Commit changes
            </Button>
            <Button
              colorScheme="blue"
              onClick={onCreateVpnServiceClick}
              leftIcon={<Icon as={FeatherIcon} icon="plus" />}
            >
              Add service
            </Button>
          </HStack>
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
