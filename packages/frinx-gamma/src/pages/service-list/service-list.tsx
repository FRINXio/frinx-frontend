import { Box, Button, Container, Flex, Heading, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { apiVpnServiceToClientVpnService } from '../../components/forms/converters';
import { VpnService } from '../../components/forms/service-types';
import unwrap from '../../helpers/unwrap';
import ServiceFilter, { ServiceFilters } from './service-filter';
import ServiceTable from './service-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';

type Props = {
  onCreateVpnServiceClick: () => void;
  onEditVpnServiceClick: (serviceId: string) => void;
};

const CreateVpnServicePage: VoidFunctionComponent<Props> = ({ onCreateVpnServiceClick, onEditVpnServiceClick }) => {
  const [vpnServices, setVpnServices] = useState<VpnService[] | null>(null);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<ServiceFilters>({
    id: null,
    customerName: null,
    // defaultCVlan: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState<ServiceFilters>({
    id: null,
    customerName: null,
    // defaultCVlan: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const callbacks = callbackUtils.getCallbacks;
      const services = await callbacks.getVpnServices(paginationParams, submittedFilters);
      const clientVpnServices = apiVpnServiceToClientVpnService(services);
      setVpnServices(clientVpnServices);
      const servicesCount = await callbacks.getVpnServiceCount();
      setPagination({
        ...pagination,
        pageCount: Math.ceil(servicesCount / pagination.pageSize),
      });
    };

    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteButtonClick(serviceId: string) {
    setServiceIdToDelete(serviceId);
    deleteModalDisclosure.onOpen();
  }

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handleFilterChange(newFilters: ServiceFilters) {
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
          callbackUtils.getCallbacks.deleteVpnService(unwrap(serviceIdToDelete)).then(() => {
            setVpnServices(unwrap(vpnServices).filter((service) => service.vpnId !== serviceIdToDelete));
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
            <Button
              colorScheme="blue"
              onClick={onCreateVpnServiceClick}
              leftIcon={<Icon as={FeatherIcon} icon="plus" />}
            >
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
                onFilterSubmit={handleFilterSubmit}
              />
              <ServiceTable
                onEditServiceButtonClick={onEditVpnServiceClick}
                onDeleteServiceButtonClick={handleDeleteButtonClick}
                services={vpnServices}
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
