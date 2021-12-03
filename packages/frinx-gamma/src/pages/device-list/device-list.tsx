import { Box, Button, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnSitesToClientVpnSite, clientVpnSiteToApiVpnSite } from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import DeviceTable from './device-table';

type Props = {
  onCreateDeviceClick: (siteId: string, locationId: string) => void;
  onEditDeviceClick: (siteId: string, locationId: string, deviceId: string) => void;
  onLocationListClick: (siteId: string) => void;
};

const DeviceListPage: VoidFunctionComponent<Props> = ({
  onCreateDeviceClick,
  onEditDeviceClick,
  onLocationListClick,
}) => {
  const [site, setSite] = useState<VpnSite | null>(null);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const { siteId, locationId } = useParams<{ siteId: string; locationId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiSites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      const selectedVpnSite = clientVpnSites.find((s) => s.siteId === siteId);
      setSite(unwrap(selectedVpnSite));
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
          const apiSite = clientVpnSiteToApiVpnSite(editedVpnSite);
          callbackUtils.getCallbacks.editVpnSite(apiSite).then(() => {
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
            Devices (Site: {site.siteId} | Location: {locationId})
          </Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              onCreateDeviceClick(siteId, locationId);
            }}
          >
            Add device
          </Button>
        </Flex>
        <Box>
          <DeviceTable
            locationId={locationId}
            onEditDeviceButtonClick={onEditDeviceClick}
            onDeleteDeviceButtonClick={handleDeleteButtonClick}
            site={site}
          />
        </Box>
        <Box py={6}>
          <Button
            onClick={() => {
              onLocationListClick(siteId);
            }}
            colorScheme="blue"
          >
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DeviceListPage;
