import { Box, Button, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams, Link } from 'react-router-dom';
import diff from 'diff-arrays-of-objects';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import {
  apiSiteDevicesToClientSiteDevices,
  apiVpnSitesToClientVpnSite,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import DeviceFilter, { DeviceFilters } from './device-filter';
import unwrap from '../../helpers/unwrap';
import usePagination from '../../hooks/use-pagination';
import { getChangedDevicesWithStatus, getSavedDevicesWithStatus } from './device-helpers';
import Pagination from '../../components/pagination/pagination';
import DeviceTable from './device-table';
import FilterContext from '../../filter-provider';

const DeviceListPage: VoidFunctionComponent = () => {
  const filterContext = useContext(FilterContext);
  const { device: deviceFilters, onDeviceFilterChange } = unwrap(filterContext);
  const [site, setSite] = useState<VpnSite | null>(null);
  const [createdDevices, setCreatedDevices] = useState<SiteDevice[] | null>(null);
  const [updatedDevices, setUpdatedDevices] = useState<SiteDevice[] | null>(null);
  const [deletedDevices, setDeletedDevices] = useState<SiteDevice[] | null>(null);
  const [devices, setDevices] = useState<SiteDevice[] | null>(null);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { siteId, locationId } = useParams<{ siteId: string; locationId?: string }>();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<DeviceFilters>(deviceFilters);
  const [submittedFilters, setSubmittedFilters] = useState<DeviceFilters>(deviceFilters);

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
      const apiDevices = await callbacks.getDevices(unwrap(siteId), paginationParams, submittedFilters, 'nonconfig');
      const clientDevices = apiSiteDevicesToClientSiteDevices(apiDevices);
      setDevices(clientDevices);
      const locationsCount = await callbacks.getDevicesCount(unwrap(siteId), submittedFilters);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(locationsCount / pagination.pageSize),
      });

      // get data for changes table
      const allSavedDevices = await callbacks.getDevices(unwrap(siteId), null, null, 'nonconfig');
      const clientAllSavedDevices = apiSiteDevicesToClientSiteDevices(allSavedDevices);
      const allUnsavedDevices = await callbacks.getDevices(unwrap(siteId), null, null);
      const clientAllUnsavedDevices = apiSiteDevicesToClientSiteDevices(allUnsavedDevices);
      const result = diff(clientAllSavedDevices, clientAllUnsavedDevices, 'deviceId');
      setCreatedDevices(result.added);
      setUpdatedDevices(result.updated);
      setDeletedDevices(result.removed);
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteButtonClick = (deviceId: string) => {
    setDeviceIdToDelete(deviceId);
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

  const handleFilterChange = (newFilters: DeviceFilters) => {
    setFilters({
      ...newFilters,
    });
  };

  const handleFilterReset = (newFilters: DeviceFilters) => {
    setPagination({
      ...pagination,
      page: 1,
    });
    const resetFilters = { ...newFilters };
    setFilters(resetFilters);
    setSubmittedFilters(resetFilters);
    onDeviceFilterChange(resetFilters);
  };

  const handleFilterSubmit = () => {
    setPagination({
      ...pagination,
      page: 1,
    });
    setSubmittedFilters(filters);
  };

  if (!site || !devices) {
    return null;
  }

  const changedDevicesWithStatus = getChangedDevicesWithStatus(createdDevices, updatedDevices, deletedDevices);
  const savedDevicesWithStatus = getSavedDevicesWithStatus(devices, updatedDevices, deletedDevices);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          const editedVpnSite: VpnSite = {
            ...site,
            siteDevices: site.siteDevices.filter((s) => s.deviceId !== deviceIdToDelete),
          };
          const apiSite = clientVpnSiteToApiVpnSite(editedVpnSite);
          callbackUtils.getCallbacks.editVpnSite(apiSite).then(() => {
            setSite(editedVpnSite);
            setCreatedDevices(createdDevices?.filter((device) => device.deviceId !== deviceIdToDelete) || []);
            setUpdatedDevices(updatedDevices?.filter((device) => device.deviceId !== deviceIdToDelete) || []);
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete device"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Devices (Site: {site.siteId}
            {locationId && ` | Location: ${locationId}`})
          </Heading>
          <Button
            colorScheme="blue"
            as={Link}
            to={locationId ? `../sites/${siteId}/${locationId}/devices/add` : `../sites/${siteId}/devices/add`}
          >
            Add device
          </Button>
        </Flex>
        <Box>
          <DeviceFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onFilterReset={handleFilterReset}
            onFilterSubmit={handleFilterSubmit}
          />
          {changedDevicesWithStatus.length ? (
            <>
              <Heading size="sm">Changes</Heading>
              <Box my="2">
                <DeviceTable
                  size="sm"
                  site={site}
                  locationId={locationId || null}
                  devices={changedDevicesWithStatus}
                  detailId={detailId}
                  onDeleteDeviceButtonClick={handleDeleteButtonClick}
                  onRowClick={handleRowClick}
                />
              </Box>
            </>
          ) : null}
          <DeviceTable
            size="md"
            site={site}
            locationId={locationId || null}
            devices={savedDevicesWithStatus}
            detailId={detailId}
            onDeleteDeviceButtonClick={handleDeleteButtonClick}
            onRowClick={handleRowClick}
          />
          <Box m="4">
            <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
          </Box>
        </Box>
        <Box py={6}>
          <Button colorScheme="blue" as={Link} to={`../sites/${siteId}/locations`}>
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DeviceListPage;
