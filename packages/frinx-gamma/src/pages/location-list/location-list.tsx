import { Box, Button, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import LocationTable from './location-table';

type Props = {
  onCreateLocationClick: (siteId: string) => void;
  onEditLocationClick: (siteId: string, locationId: string) => void;
  onDevicesVpnSiteClick: (siteId: string, locationId: string) => void;
  onSiteListClick: () => void;
};

const LocationListPage: VoidFunctionComponent<Props> = ({
  onCreateLocationClick,
  onEditLocationClick,
  onDevicesVpnSiteClick,
  onSiteListClick,
}) => {
  const [site, setSite] = useState<VpnSite | null>(null);
  const [locationIdToDelete, setLocationIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const { siteId } = useParams<{ siteId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiSites = await callbacks.getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      const selectedVpnSite = clientVpnSites.find((s) => s.siteId === siteId);
      setSite(unwrap(selectedVpnSite));
    };

    fetchData();
  }, [siteId]);

  function handleDeleteButtonClick(deviceId: string) {
    setLocationIdToDelete(deviceId);
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
            customerLocations: site.customerLocations.filter((s) => s.locationId !== locationIdToDelete),
          };
          callbackUtils.getCallbacks.editVpnSite(editedVpnSite).then(() => {
            setSite(editedVpnSite);
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete location"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Locations (Site: {site.siteId})
          </Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              onCreateLocationClick(siteId);
            }}
          >
            Add location
          </Button>
        </Flex>
        <Box>
          <LocationTable
            onDeleteLocationButtonClick={handleDeleteButtonClick}
            onEditLocationButtonClick={onEditLocationClick}
            onDevicesSiteButtonClick={onDevicesVpnSiteClick}
            site={site}
          />
        </Box>
        <Box py={6}>
          <Button
            onClick={() => {
              onSiteListClick();
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

export default LocationListPage;
