import { Box, Button, Container, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnSitesToClientVpnSite } from '../../components/forms/converters';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import SiteFilter, { SiteFilters } from './site-filter';
import SiteTable from './site-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import { getSavedSitesWithStatus, getSiteChanges, VpnSiteWithStatus } from './site-helpers';
import FilterContext from '../../filter-provider';
import useCalcDiffContext from '../../providers/calcdiff-provider/use-calcdiff-context';
import { StatusEnum } from '../service-list/service-helpers';

const SiteListPage: VoidFunctionComponent = () => {
  const filterContext = useContext(FilterContext);
  const { site: siteFilters, onSiteFilterChange } = unwrap(filterContext);
  const { invalidateCache, data: calcDiffData } = useCalcDiffContext();
  const [sites, setSites] = useState<VpnSite[] | null>(null);
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<SiteFilters>(siteFilters);
  const [submittedFilters, setSubmittedFilters] = useState<SiteFilters>(siteFilters);
  const [siteChanges, setSiteChanges] = useState<VpnSiteWithStatus[] | null>(null);
  const navigate = useNavigate();

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
    };

    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchData = async () => {
      if (calcDiffData?.service) {
        const changes = await getSiteChanges(calcDiffData.service);
        setSiteChanges(changes);
      }
    };
    fetchData();
  }, [calcDiffData]);

  const handleDeleteButtonClick = (siteId: string) => {
    setSiteIdToDelete(siteId);
    deleteModalDisclosure.onOpen();
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleFilterChange = (newFilters: SiteFilters) => {
    setFilters({
      ...newFilters,
    });
  };

  const handleFilterSubmit = () => {
    setPagination({
      ...pagination,
      page: 1,
    });
    setSubmittedFilters(filters);
    onSiteFilterChange(filters);
  };

  const handleRowClick = (rowId: string, isOpen: boolean) => {
    setDetailId(isOpen ? rowId : null);
  };

  const handleEditSiteRedirect = (siteId: string) => {
    navigate(`../sites/edit/${siteId}`);
  };

  const handleDetailRedirect = (siteId: string) => {
    navigate(`../sites/detail/${siteId}`);
  };

  const handleLocationsRedirect = (siteId: string) => {
    navigate(`../sites/${siteId}/locations`);
  };

  const handleDevicesRedirect = (siteId: string) => {
    navigate(`../sites/${siteId}/devices`);
  };

  const updatedSites = siteChanges?.filter((s) => s.status === StatusEnum.UPDATED) || [];
  const deletedSites = siteChanges?.filter((s) => s.status === StatusEnum.DELETED) || [];
  const savedSitesWithStatus = getSavedSitesWithStatus(sites, updatedSites, deletedSites);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          callbackUtils.getCallbacks.deleteVpnSite(unwrap(siteIdToDelete)).then(() => {
            invalidateCache();
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
            <Button leftIcon={<SearchIcon />} colorScheme="blue" as={Link} to="../search">
              Advanced Search
            </Button>
            <Button colorScheme="blue" as={Link} to="../sites/add">
              Add site
            </Button>
          </HStack>
        </Flex>
        <Box>
          {sites ? (
            <>
              <SiteFilter filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} />
              {siteChanges && siteChanges.length ? (
                <>
                  <Heading size="sm">Changes</Heading>
                  <Box my="2">
                    <SiteTable
                      sites={siteChanges}
                      size="sm"
                      detailId={detailId}
                      onEditSiteButtonClick={handleEditSiteRedirect}
                      onDetailSiteButtonClick={handleDetailRedirect}
                      onLocationsSiteButtonClick={handleLocationsRedirect}
                      onDevicesSiteButtonClick={handleDevicesRedirect}
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
                onEditSiteButtonClick={handleEditSiteRedirect}
                onDetailSiteButtonClick={handleDetailRedirect}
                onLocationsSiteButtonClick={handleLocationsRedirect}
                onDevicesSiteButtonClick={handleDevicesRedirect}
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
