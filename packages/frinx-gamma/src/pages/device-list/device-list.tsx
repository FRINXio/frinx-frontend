import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import DeviceTable from './device-table';
import { VpnSite } from '../../components/forms/site-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';

type Props = {
  onCreateDeviceClick: (siteId: string) => void;
  onEditDeviceClick: (siteId: string, deviceId: string) => void;
  onSiteListClick: () => void;
};

const DeviceListPage: VoidFunctionComponent<Props> = ({ onCreateDeviceClick, onEditDeviceClick, onSiteListClick }) => {
  const [site, setSite] = useState<VpnSite | null>(null);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const { siteId } = useParams<{ siteId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiSites = await callbacks.getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      const [selectedVpnSite] = clientVpnSites.filter((s) => s.siteId === siteId);
      setSite(selectedVpnSite);
    };

    fetchData();
  }, [siteId]);

  function handleDeleteButtonClick(deviceId: string) {
    setDeviceIdToDelete(deviceId);
    deleteModalDisclosure.onOpen();
  }

  if (!site) {
    return null;
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          const editedVpnSite: VpnSite = {
            ...site,
            siteDevices: site.siteDevices.filter((s) => s.deviceId !== deviceIdToDelete),
          };
          callbackUtils.getCallbacks.editVpnSite(editedVpnSite).then(() => {
            setSite(editedVpnSite);
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete device"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Devices (Site: {site.siteId})
          </Heading>
          <Button colorScheme="blue" onClick={() => onCreateDeviceClick(siteId)}>
            Add device
          </Button>
        </Flex>
        <Box>
          <DeviceTable
            onEditDeviceButtonClick={onEditDeviceClick}
            onDeleteDeviceButtonClick={handleDeleteButtonClick}
            site={site}
          />
        </Box>
        <Box py={6}>
          <Button onClick={() => onSiteListClick()} colorScheme="blue">
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DeviceListPage;
