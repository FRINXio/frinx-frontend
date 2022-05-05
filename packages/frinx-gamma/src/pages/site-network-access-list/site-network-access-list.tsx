import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import {
  apiSiteNetworkAccessToClientSiteNetworkAccess,
  apiVpnSitesToClientVpnSite,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import SiteNetworkAccessTable from './site-network-access-table';
import { SiteNetworkAccess, VpnSite } from '../../components/forms/site-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../unistore-callback-utils';
import SiteNetworkAccessFilter, { SiteNetworkAccessFilters } from './site-network-access-filter';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import {
  getSavedNetworkAccessesWithStatus,
  getSiteNetworkChanges,
  SiteNetworkAccessWithStatus,
} from './site-network-access-helpers';
import { CalcDiffContext } from '../../providers/calcdiff-provider/calcdiff-provider';
import unwrap from '../../helpers/unwrap';
import FilterContext from '../../filter-provider';
import { StatusEnum } from '../service-list/service-helpers';
import CalcdiffLoading from '../../components/calcdiff-loading/calcdiff-loading';

const SiteListPage: VoidFunctionComponent = () => {
  const filterContext = useContext(FilterContext);
  const { siteNetworkAccess: networkFilters, onSiteNetworkAccessFilterChange } = unwrap(filterContext);
  const calcdiffContext = useContext(CalcDiffContext);
  const { invalidateCache, data: calcDiffData, isLoading: isCalcdiffLoading } = unwrap(calcdiffContext);
  const [site, setSite] = useState<VpnSite | null>(null);
  const [networkAccesses, setNetworkAccesses] = useState<SiteNetworkAccess[] | null>(null);
  const [siteAccessIdToDelete, setSiteAccessIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { siteId } = useParams<{ siteId: string }>();
  const [pagination, setPagination] = usePagination();
  const [networkAccessChanges, setNetworkAccessChanges] = useState<SiteNetworkAccessWithStatus[] | null>(null);
  const [filters, setFilters] = useState<SiteNetworkAccessFilters>(networkFilters);
  const [submittedFilters, setSubmittedFilters] = useState<SiteNetworkAccessFilters>(networkFilters);

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
      if (calcDiffData?.service) {
        const changes = await getSiteNetworkChanges(calcDiffData.service, unwrap(siteId));
        setNetworkAccessChanges(changes);
      }
    };
    fetchData();
  }, [calcDiffData, siteId]);

  useEffect(() => {
    const fetchData = async () => {
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const callbacks = callbackUtils.getCallbacks;
      const apiNetworkAccesses = await callbacks.getSiteNetworkAccesses(
        unwrap(siteId),
        paginationParams,
        submittedFilters,
        'nonconfig',
      );
      const clientNetworkAccesses = apiSiteNetworkAccessToClientSiteNetworkAccess(apiNetworkAccesses);
      setNetworkAccesses(clientNetworkAccesses);
      const networkAccessesCount = await callbacks.getSiteNetworkAccessesCount(
        unwrap(siteId),
        submittedFilters,
        'nonconfig',
      );
      setPagination({
        ...pagination,
        pageCount: Math.ceil(networkAccessesCount / pagination.pageSize),
      });
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteButtonClick = (siteAccessId: string) => {
    setSiteAccessIdToDelete(siteAccessId);
    deleteModalDisclosure.onOpen();
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleFilterReset = (newFilters: SiteNetworkAccessFilters) => {
    setPagination({
      ...pagination,
      page: 1,
    });
    setFilters({
      ...newFilters,
    });
    setSubmittedFilters(newFilters);
    onSiteNetworkAccessFilterChange(newFilters);
  };

  const handleFilterChange = (newFilters: SiteNetworkAccessFilters) => {
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
  };

  const handleRowClick = (rowId: string, isOpen: boolean) => {
    setDetailId(isOpen ? rowId : null);
  };

  if (!site || !networkAccesses) {
    return null;
  }

  const updatedNetworkAccesses = networkAccessChanges?.filter((n) => n.status === StatusEnum.UPDATED) || [];
  const deletedNetworkAccesses = networkAccessChanges?.filter((n) => n.status === StatusEnum.DELETED) || [];
  const savedNetworkAccessesWithStatus = getSavedNetworkAccessesWithStatus(
    networkAccesses,
    updatedNetworkAccesses,
    deletedNetworkAccesses,
  );

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
          const apiSite = clientVpnSiteToApiVpnSite(editedVpnSite);
          callbackUtils.getCallbacks.editVpnSite(apiSite).then(() => {
            setSite(editedVpnSite);
            invalidateCache();
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
          <Button colorScheme="blue" as={Link} to={`../sites/detail/${unwrap(siteId)}/add-access`}>
            Add network access
          </Button>
        </Flex>
        <Box>
          <>
            <SiteNetworkAccessFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
              onFilterSubmit={handleFilterSubmit}
            />
            {isCalcdiffLoading && <CalcdiffLoading />}
            {!isCalcdiffLoading && networkAccessChanges && networkAccessChanges.length ? (
              <>
                <Heading size="sm">Changes</Heading>
                <Box my="2">
                  <SiteNetworkAccessTable
                    siteId={unwrap(siteId)}
                    size="sm"
                    detailId={detailId}
                    networkAccesses={networkAccessChanges}
                    onDeleteSiteNetworkAccessButtonClick={handleDeleteButtonClick}
                    onRowClick={handleRowClick}
                  />
                </Box>
              </>
            ) : null}
            <SiteNetworkAccessTable
              siteId={unwrap(siteId)}
              detailId={detailId}
              size="md"
              networkAccesses={savedNetworkAccessesWithStatus}
              onDeleteSiteNetworkAccessButtonClick={handleDeleteButtonClick}
              onRowClick={handleRowClick}
            />
            <Box m="4">
              <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
            </Box>
          </>
        </Box>
        <Box py={6}>
          <Button as={Link} to="../sites" colorScheme="blue">
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SiteListPage;
