import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import SiteNetworkAccessTable from './site-network-access-table';
import { VpnSite } from '../../components/forms/site-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';
// import unwrap from '../../helpers/unwrap';

type Props = {
  onCreateSiteNetworkAccessClick: (siteId: string) => void;
  onEditSiteNetworkAccessClick: (siteId: string, accessId: string) => void;
  onSiteListClick: () => void;
};

const SiteListPage: VoidFunctionComponent<Props> = ({
  onCreateSiteNetworkAccessClick,
  onEditSiteNetworkAccessClick,
  onSiteListClick,
}) => {
  const [site, setSite] = useState<VpnSite | null>(null);
  const [siteAccessIdToDelete, setSiteAccessIdToDelete] = useState<string | null>(null);
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

  function handleDeleteButtonClick(siteAccessId: string) {
    setSiteAccessIdToDelete(siteAccessId);
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
            siteNetworkAccesses: site.siteNetworkAccesses.filter((s) => s.siteNetworkAccessId !== siteAccessIdToDelete),
          };
          callbackUtils.getCallbacks.editVpnSite(editedVpnSite).then(() => {
            setSite(editedVpnSite);
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete site network access"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Sites Network Accesses (Site: {site.siteId})
          </Heading>
          <Button colorScheme="blue" onClick={() => onCreateSiteNetworkAccessClick(siteId)}>
            Add network access
          </Button>
        </Flex>
        <Box>
          <SiteNetworkAccessTable
            onEditSiteNetworkAccessButtonClick={onEditSiteNetworkAccessClick}
            onDeleteSiteNetworkAccessButtonClick={handleDeleteButtonClick}
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

export default SiteListPage;
