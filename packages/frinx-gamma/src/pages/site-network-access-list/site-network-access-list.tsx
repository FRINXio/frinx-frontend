import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import {
  apiSiteNetworkAccessToClientSiteNetworkAccess,
  apiVpnSitesToClientVpnSite,
} from '../../components/forms/converters';
import SiteNetworkAccessTable from './site-network-access-table';
import { SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../callback-utils';
import SiteNetworkAccessFilter, { SiteNetworkAccessFilters } from './site-network-access-filter';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';

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
  const [networkAccesses, setNetworkAccesses] = useState<SiteNetworkAccess[] | null>(null);
  const [siteAccessIdToDelete, setSiteAccessIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const { siteId } = useParams<{ siteId: string }>();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<SiteNetworkAccessFilters>({
    id: null,
    locationId: null,
    deviceId: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState<SiteNetworkAccessFilters>({
    id: null,
    locationId: null,
    deviceId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiSites = await callbacks.getVpnSites(null, null);
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      const [selectedVpnSite] = clientVpnSites.filter((s) => s.siteId === siteId);

      setSite(selectedVpnSite);
    };

    fetchData();
  }, [siteId]);

  useEffect(() => {
    const fetchData = async () => {
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const callbacks = callbackUtils.getCallbacks;
      const apiNetworkAccesses = await callbacks.getSiteNetworkAccesses(siteId, paginationParams, submittedFilters);
      const clientNetworkAccesses = apiSiteNetworkAccessToClientSiteNetworkAccess(apiNetworkAccesses);
      setNetworkAccesses(clientNetworkAccesses);
      const networkAccessesCount = await callbacks.getSiteNetworkAccessesCount(siteId, submittedFilters);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(networkAccessesCount / pagination.pageSize),
      });
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteButtonClick(siteAccessId: string) {
    setSiteAccessIdToDelete(siteAccessId);
    deleteModalDisclosure.onOpen();
  }

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handleFilterChange(newFilters: SiteNetworkAccessFilters) {
    setFilters({
      ...newFilters,
    });
  }

  function handleFilterSubmit() {
    setPagination({
      ...pagination,
      page: 1,
    });
    setSubmittedFilters(filters);
  }

  if (!site || !networkAccesses) {
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
          <>
            <SiteNetworkAccessFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
            />
            <SiteNetworkAccessTable
              siteId={siteId}
              networkAccesses={networkAccesses}
              onEditSiteNetworkAccessButtonClick={onEditSiteNetworkAccessClick}
              onDeleteSiteNetworkAccessButtonClick={handleDeleteButtonClick}
            />
            <Box m="4">
              <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
            </Box>
          </>
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
