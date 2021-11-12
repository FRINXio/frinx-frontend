import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button, HStack } from '@chakra-ui/react';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import SiteTable from './site-table';
import { VpnSite } from '../../components/forms/site-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';
import unwrap from '../../helpers/unwrap';
import CommitStatusModal from '../../components/commit-status-modal/commit-status-modal';
import { setTransactionId } from '../../helpers/transaction-id';

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
  const [workflowId, setWorkflowId] = useState<string | null>(null);
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

  function handleCommitBtnClick() {
    const callbacks = callbackUtils.getCallbacks;
    callbacks
      .executeWorkflow({
        name: 'Render_all',
        version: 1,
        input: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          unistore_node_name: 'network',
          action: 'commit',
        },
      })
      .then((data) => {
        setWorkflowId(data.text);
      })
      .finally(() => setTransactionId());
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
            Sites
          </Heading>
          <HStack>
            <Button variant="outline" colorScheme="blue" onClick={handleCommitBtnClick}>
              Commit changes
            </Button>
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
