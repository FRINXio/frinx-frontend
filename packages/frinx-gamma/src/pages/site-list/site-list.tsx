import { Box, Button, Container, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import SiteFilter, { SiteFilters } from './site-filter';
import SiteTable from './site-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';

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
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<SiteFilters>({
    id: null,
    locationId: null,
    deviceId: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState<SiteFilters>({
    id: null,
    locationId: null,
    deviceId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const apiSites = await callbacks.getVpnSites(paginationParams, submittedFilters);
      const clientVpnSites = apiVpnSitesToClientVpnSite(apiSites);
      setSites(clientVpnSites);
      const sitesCount = await callbacks.getVpnSiteCount();
      setPagination({
        ...pagination,
        pageCount: Math.ceil(sitesCount / pagination.pageSize),
      });
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
            <>
              <SiteFilter filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} />
              <SiteTable
                onEditSiteButtonClick={onEditVpnSiteClick}
                onDetailSiteButtonClick={onDetailVpnSiteClick}
                onLocationsSiteButtonClick={onLocationsVpnSiteClick}
                onDeleteSiteButtonClick={handleDeleteButtonClick}
                sites={sites}
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
