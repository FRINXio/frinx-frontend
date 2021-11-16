import { Box, Button, Container, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import SiteTable from './site-table';

type Props = {
  onCreateVpnSiteClick: () => void;
  onEditVpnSiteClick: (siteId: string) => void;
  onLocationsVpnSiteClick: (siteId: string) => void;
  onDetailVpnSiteClick: (siteId: string) => void;
};

const SiteListPage: VoidFunctionComponent<Props> = ({
  onCreateVpnSiteClick,
  onEditVpnSiteClick,
  onLocationsVpnSiteClick,
  onDetailVpnSiteClick,
}) => {
  const [sites, setSites] = useState<VpnSite[] | null>(null);
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiSites = await callbacks.getVpnSites();
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      setSites(clientVpnSites);
    };

    fetchData();
  }, []);

  function handleDeleteButtonClick(siteId: string) {
    setSiteIdToDelete(siteId);
    deleteModalDisclosure.onOpen();
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          callbackUtils.getCallbacks.deleteVpnSite(unwrap(siteIdToDelete)).then(() => {
            setSites(unwrap(sites).filter((site) => site.siteId !== siteIdToDelete));
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete site"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Sites
          </Heading>
          <HStack>
            <Button colorScheme="blue" onClick={onCreateVpnSiteClick}>
              Add site
            </Button>
          </HStack>
        </Flex>
        <Box>
          {sites ? (
            <SiteTable
              onEditSiteButtonClick={onEditVpnSiteClick}
              onDetailSiteButtonClick={onDetailVpnSiteClick}
              onLocationsSiteButtonClick={onLocationsVpnSiteClick}
              onDeleteSiteButtonClick={handleDeleteButtonClick}
              sites={sites}
            />
          ) : null}
        </Box>
      </Container>
    </>
  );
};

export default SiteListPage;
