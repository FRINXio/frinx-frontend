import { Box, Button, Container, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import diff from 'diff-arrays-of-objects';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import SiteFilter, { getDefaultSiteFilter, SiteFilters } from './site-filter';
import SiteTable from './site-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import { getChangedSitesWithStatus, getSavedSitesWithStatus } from './site-helpers';
import FilterContext from '../../filter-provider';

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
  const filterContext = useContext(FilterContext);
  const { site: siteFilters, onSiteFilterChange } = unwrap(filterContext);
  const [createdSites, setCreatedSites] = useState<VpnSite[] | null>(null);
  const [updatedSites, setUpdatedSites] = useState<VpnSite[] | null>(null);
  const [deletedSites, setDeletedSites] = useState<VpnSite[] | null>(null);
  const [sites, setSites] = useState<VpnSite[] | null>(null);
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<SiteFilters>(siteFilters);
  const [submittedFilters, setSubmittedFilters] = useState<SiteFilters>(siteFilters);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const apiSites = await callbacks.getVpnSites(paginationParams, submittedFilters, 'nonconfig');
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      setSites(clientVpnSites);
      const sitesCount = await callbacks.getVpnSiteCount(submittedFilters, 'nonconfig');
      setPagination({
        ...pagination,
        pageCount: Math.ceil(sitesCount / pagination.pageSize),
      });

      // get data for changes table
      const allSavedSites = await callbacks.getVpnSites(null, null, 'nonconfig');
      const clientAllSavedSites = apiVpnSitesToClientVpnSite(allSavedSites);
      const allUnsavedSites = await callbacks.getVpnSites(null, null);
      const clientAllUnsavedSites = apiVpnSitesToClientVpnSite(allUnsavedSites);
      const result = diff(clientAllSavedSites, clientAllUnsavedSites, 'siteId');
      setCreatedSites(result.added);
      setUpdatedSites(result.updated);
      setDeletedSites(result.removed);
    };

    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteButtonClick(siteId: string) {
    setSiteIdToDelete(siteId);
    deleteModalDisclosure.onOpen();
  }

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handleFilterChange(newFilters: SiteFilters) {
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
    onSiteFilterChange(filters);
  }

  function handleRowClick(rowId: string, isOpen: boolean) {
    setDetailId(isOpen ? rowId : null);
  }

  const changedSitesWithStatus = getChangedSitesWithStatus(createdSites, updatedSites, deletedSites);
  const savedSitesWithStatus = getSavedSitesWithStatus(sites, updatedSites, deletedSites);

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
            <>
              <SiteFilter filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} />
              {changedSitesWithStatus.length ? (
                <>
                  <Heading size="sm">Changes</Heading>
                  <Box my="2">
                    <SiteTable
                      sites={changedSitesWithStatus}
                      size="sm"
                      detailId={null}
                      onEditSiteButtonClick={onEditVpnSiteClick}
                      onDetailSiteButtonClick={onDetailVpnSiteClick}
                      onLocationsSiteButtonClick={onLocationsVpnSiteClick}
                      onDeleteSiteButtonClick={handleDeleteButtonClick}
                      onRowClick={handleRowClick}
                    />
                  </Box>
                </>
              ) : null}
              <SiteTable
                sites={savedSitesWithStatus}
                size="md"
                detailId={detailId}
                onEditSiteButtonClick={onEditVpnSiteClick}
                onDetailSiteButtonClick={onDetailVpnSiteClick}
                onLocationsSiteButtonClick={onLocationsVpnSiteClick}
                onDeleteSiteButtonClick={handleDeleteButtonClick}
                onRowClick={handleRowClick}
              />
              <Box m="4">
                <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
              </Box>
            </>
          ) : null}
        </Box>
      </Container>
    </>
  );
};

export default SiteListPage;
