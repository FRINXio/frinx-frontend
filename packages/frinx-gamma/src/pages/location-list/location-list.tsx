import { Box, Button, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import {
  apiLocationsToClientLocations,
  apiVpnSitesToClientVpnSite,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import { VpnSite, CustomerLocation } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import LocationTable from './location-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import LocationFilter, { getDefaultLocationFilters, LocationFilters } from './location-filter';
import { Link } from 'react-router-dom';

const LocationListPage: VoidFunctionComponent = () => {
  const [site, setSite] = useState<VpnSite | null>(null);
  const [locations, setLocations] = useState<CustomerLocation[] | null>(null);
  const [locationIdToDelete, setLocationIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { siteId } = useParams<{ siteId: string }>();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<LocationFilters>(getDefaultLocationFilters());
  const [submittedFilters, setSubmittedFilters] = useState<LocationFilters>(getDefaultLocationFilters());

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

  useEffect(() => {
    const fetchData = async () => {
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const callbacks = callbackUtils.getCallbacks;
      const apiLocations = await callbacks.getLocations(unwrap(siteId), paginationParams, submittedFilters);
      const clientLocations = apiLocationsToClientLocations(apiLocations);
      setLocations(clientLocations);
      const locationsCount = await callbacks.getLocationsCount(unwrap(siteId), submittedFilters);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(locationsCount / pagination.pageSize),
      });
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteButtonClick = (deviceId: string) => {
    setLocationIdToDelete(deviceId);
    deleteModalDisclosure.onOpen();
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleRowClick = (rowId: string, isOpen: boolean) => {
    setDetailId(isOpen ? rowId : null);
  };

  const handleFilterChange = (newFilters: LocationFilters) => {
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
          const apiSite = clientVpnSiteToApiVpnSite(editedVpnSite);
          callbackUtils.getCallbacks.editVpnSite(apiSite).then(() => {
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
          <Button colorScheme="blue" as={Link} to={`../sites/${siteId}/locations/add`}>
            Add location
          </Button>
        </Flex>
        <Box>
          <>
            <LocationFilter filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} />
            <LocationTable
              site={site}
              detailId={detailId}
              locations={locations || []}
              onDeleteLocationButtonClick={handleDeleteButtonClick}
              onRowClick={handleRowClick}
            />
            <Box m="4">
              <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
            </Box>
          </>
        </Box>
        <Box py={6}>
          <Button colorScheme="blue" as={Link} to={`../sites`}>
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default LocationListPage;
