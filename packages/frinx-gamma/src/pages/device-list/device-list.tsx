import { Box, Button, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useParams } from 'react-router';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import {
  apiSiteDevicesToClientSiteDevices,
  apiVpnSitesToClientVpnSite,
  clientVpnSiteToApiVpnSite,
} from '../../components/forms/converters';
import { SiteDevice, VpnSite } from '../../components/forms/site-types';
import DeviceFilter, { DeviceFilters, getDefaultDeviceFilters } from './device-filter';
import unwrap from '../../helpers/unwrap';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import DeviceTable from './device-table';

type Props = {
  onCreateDeviceClick: (siteId: string, locationId: string) => void;
  onEditDeviceClick: (siteId: string, locationId: string, deviceId: string) => void;
  onLocationListClick: (siteId: string) => void;
};

const DeviceListPage: VoidFunctionComponent<Props> = ({
  onCreateDeviceClick,
  onEditDeviceClick,
  onLocationListClick,
}) => {
  const [site, setSite] = useState<VpnSite | null>(null);
  const [devices, setDevices] = useState<SiteDevice[] | null>(null);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { siteId, locationId } = useParams<{ siteId: string; locationId: string }>();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<DeviceFilters>(getDefaultDeviceFilters());
  const [submittedFilters, setSubmittedFilters] = useState<DeviceFilters>(getDefaultDeviceFilters());

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
      const apiDevices = await callbacks.getDevices(siteId, paginationParams, submittedFilters);
      const clientDevices = apiSiteDevicesToClientSiteDevices(apiDevices);
      setDevices(clientDevices);
      const locationsCount = await callbacks.getDevicesCount(siteId, submittedFilters);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(locationsCount / pagination.pageSize),
      });
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteButtonClick(deviceId: string) {
    setDeviceIdToDelete(deviceId);
    deleteModalDisclosure.onOpen();
  }

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handleRowClick(rowId: string, isOpen: boolean) {
    setDetailId(isOpen ? rowId : null);
  }

  function handleFilterChange(newFilters: DeviceFilters) {
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

  if (!site || !devices) {
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
            siteDevices: site.siteDevices.filter((s) => s.deviceId !== deviceIdToDelete),
          };
          const apiSite = clientVpnSiteToApiVpnSite(editedVpnSite);
          callbackUtils.getCallbacks.editVpnSite(apiSite).then(() => {
            setSite(editedVpnSite);
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
            Devices (Site: {site.siteId} | Location: {locationId})
          </Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              onCreateDeviceClick(siteId, locationId);
            }}
          >
            Add device
          </Button>
        </Flex>
        <Box>
          <DeviceFilter filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} />
          <DeviceTable
            site={site}
            devices={devices}
            detailId={detailId}
            onEditDeviceButtonClick={onEditDeviceClick}
            onDeleteDeviceButtonClick={handleDeleteButtonClick}
            onRowClick={handleRowClick}
          />
          <Box m="4">
            <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
          </Box>
        </Box>
        <Box py={6}>
          <Button
            onClick={() => {
              onLocationListClick(siteId);
            }}
            colorScheme="blue"
          >
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DeviceListPage;
