import { Box, Button, Container, Flex, Heading, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { VpnService } from '../../components/forms/service-types';
import unwrap from '../../helpers/unwrap';
import ServiceFilter, { ServiceFilters } from './service-filter';
import ServiceTable from './service-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import { getServiceChanges, getSavedServicesWithStatus, VpnServiceWithStatus } from './service-helpers';
import { CalcDiffContext } from '../../providers/calcdiff-provider/calcdiff-provider';
import FilterContext from '../../filter-provider';

const CreateVpnServicePage: VoidFunctionComponent = () => {
  const calcdiffContext = useContext(CalcDiffContext);
  const { invalidateCache, data: calcDiffData } = unwrap(calcdiffContext);
  const [serviceChanges, setServiceChanges] = useState<VpnServiceWithStatus[] | null>(null);

  const filterContext = useContext(FilterContext);
  const { service: serviceFilters, onServiceFilterChange } = unwrap(filterContext);
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<ServiceFilters>(serviceFilters);
  const [submittedFilters, setSubmittedFilters] = useState<ServiceFilters>({
    id: null,
    customerName: null,
    // defaultCVlan: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const callbacks = callbackUtils.getCallbacks;
      const services = await callbacks.getVpnServices(paginationParams, submittedFilters, 'nonconfig');
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
      const servicesCount = await callbacks.getVpnServiceCount(submittedFilters, 'nonconfig');
      setPagination({
        ...pagination,
        pageCount: Math.ceil(servicesCount / pagination.pageSize),
      });
    };

    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchData = async () => {
      if (calcDiffData?.service) {
        const changes = await getServiceChanges(calcDiffData.service);
        setServiceChanges(changes);
      }
    };
    fetchData();
  }, [calcDiffData]);

  const handleDeleteButtonClick = (serviceId: string) => {
    setServiceIdToDelete(serviceId);
    deleteModalDisclosure.onOpen();
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleFilterReset = (newFilters: ServiceFilters) => {
    setPagination({
      ...pagination,
      page: 1,
    });
    setFilters({
      ...newFilters,
    });
    setSubmittedFilters(newFilters);
    onServiceFilterChange(newFilters);
  };

  const handleFilterChange = (newFilters: ServiceFilters) => {
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

  const handleEditRedirect = (serviceId: string) => {
    navigate(`../services/edit/${unwrap(serviceId)}`);
  };

  const savedServicesWithStatus = getSavedServicesWithStatus(
    vpnServices,
    serviceChanges?.filter((s) => s.status === 'UPDATED') || [],
    serviceChanges?.filter((s) => s.status === 'DELETED') || [],
  );

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          callbackUtils.getCallbacks.deleteVpnService(unwrap(serviceIdToDelete)).then(() => {
            invalidateCache();
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete service"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            VPN Services
          </Heading>
          <HStack>
            <Button colorScheme="blue" leftIcon={<Icon as={FeatherIcon} icon="plus" />} as={Link} to="../services/add">
              Add service
            </Button>
          </HStack>
        </Flex>
        <Box>
          {vpnServices ? (
            <>
              <ServiceFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterReset={handleFilterReset}
                onFilterSubmit={handleFilterSubmit}
              />
              {serviceChanges && serviceChanges.length ? (
                <>
                  <Heading size="sm">Changes</Heading>
                  <Box my="2">
                    <ServiceTable
                      size="sm"
                      detailId={detailId}
                      services={serviceChanges}
                      onEditServiceButtonClick={handleEditRedirect}
                      onDeleteServiceButtonClick={handleDeleteButtonClick}
                      onRowClick={handleRowClick}
                    />
                  </Box>
                </>
              ) : null}
              <ServiceTable
                size="md"
                detailId={detailId}
                onEditServiceButtonClick={handleEditRedirect}
                onDeleteServiceButtonClick={handleDeleteButtonClick}
                services={savedServicesWithStatus}
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

export default CreateVpnServicePage;
