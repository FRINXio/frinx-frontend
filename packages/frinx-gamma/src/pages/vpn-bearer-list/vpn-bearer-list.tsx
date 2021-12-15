import { Box, Button, Container, Flex, Heading, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import diff from 'diff-arrays-of-objects';
import callbackUtils from '../../unistore-callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { VpnBearer } from '../../components/forms/bearer-types';
import { apiBearerToClientBearer } from '../../components/forms/converters';
import unwrap from '../../helpers/unwrap';
import VpnBearerFilter, { getDefaultBearerFilters, VpnBearerFilters } from './vpn-bearer-filter';
import VpnBearerTable from './vpn-bearer-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import { getChangedBearersWithStatus, getSavedBearersWithStatus } from './bearer-helpers';

type Props = {
  onCreateVpnNodeClick: () => void;
  onCreateVpnCarrierClick: () => void;
  onCreateVpnBearerClick: () => void;
  onEditVpnBearerClick: (bearerId: string) => void;
  onEvcAttachmentSiteClick: (bearerId: string) => void;
};

const VpnBearerList: VoidFunctionComponent<Props> = ({
  onCreateVpnNodeClick,
  onCreateVpnCarrierClick,
  onCreateVpnBearerClick,
  onEditVpnBearerClick,
  onEvcAttachmentSiteClick,
}) => {
  const [createdBearers, setCreatedBearers] = useState<VpnBearer[] | null>(null);
  const [updatedBearers, setUpdatedBearers] = useState<VpnBearer[] | null>(null);
  const [deletedBearers, setDeletedBearers] = useState<VpnBearer[] | null>(null);
  const [vpnBearers, setVpnBearers] = useState<VpnBearer[] | null>(null);
  const [bearerIdToDelete, setBearerIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<VpnBearerFilters>(getDefaultBearerFilters());
  const [submittedFilters, setSubmittedFilters] = useState<VpnBearerFilters>(getDefaultBearerFilters());

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const response = await callbacks.getVpnBearers(paginationParams, submittedFilters, 'nonconfig');
      const clientVpnBearers = apiBearerToClientBearer(response);
      setVpnBearers(clientVpnBearers);
      const bearersCount = await callbacks.getVpnBearerCount(submittedFilters, 'nonconfig');
      setPagination({
        ...pagination,
        pageCount: Math.ceil(bearersCount / pagination.pageSize),
      });

      // get data for changes table
      const allSavedBearers = await callbacks.getVpnBearers(null, null, 'nonconfig');
      const clientAllSavedBearers = apiBearerToClientBearer(allSavedBearers);
      const allUnsavedBearers = await callbacks.getVpnBearers(null, null);
      const clientAllUnsavedBearers = apiBearerToClientBearer(allUnsavedBearers);
      const result = diff(clientAllSavedBearers, clientAllUnsavedBearers, 'spBearerReference');
      setCreatedBearers(result.added);
      setUpdatedBearers(result.updated);
      setDeletedBearers(result.removed);
    };

    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteButtonClick(bearerId: string) {
    setBearerIdToDelete(bearerId);
    deleteModalDisclosure.onOpen();
  }

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handleFilterChange(newFilters: VpnBearerFilters) {
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

  function handleRowClick(rowId: string, isOpen: boolean) {
    setDetailId(isOpen ? rowId : null);
  }

  const changedBearersWithStatus = getChangedBearersWithStatus(createdBearers, updatedBearers, deletedBearers);
  const savedBearersWithStatus = getSavedBearersWithStatus(vpnBearers, updatedBearers, deletedBearers);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          callbackUtils.getCallbacks.deleteVpnBearer(unwrap(bearerIdToDelete)).then(() => {
            setVpnBearers(unwrap(vpnBearers).filter((bearer) => bearer.spBearerReference !== bearerIdToDelete));
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete bearer"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1200}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Bearers
          </Heading>
          <HStack>
            <Button colorScheme="blue" onClick={onCreateVpnNodeClick}>
              Nodes
            </Button>
            <Button colorScheme="blue" onClick={onCreateVpnCarrierClick}>
              Carriers
            </Button>
            <Button
              colorScheme="blue"
              onClick={onCreateVpnBearerClick}
              leftIcon={<Icon as={FeatherIcon} icon="plus" />}
            >
              Add bearer
            </Button>
          </HStack>
        </Flex>
        <Box>
          {vpnBearers && (
            <>
              <VpnBearerFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
              />
              {changedBearersWithStatus.length ? (
                <>
                  <Heading size="sm">Changes</Heading>
                  <Box my="2">
                    <VpnBearerTable
                      size="sm"
                      detailId={null}
                      bearers={changedBearersWithStatus}
                      onEditVpnBearerClick={onEditVpnBearerClick}
                      onDeleteVpnBearerClick={handleDeleteButtonClick}
                      onEvcAttachmentSiteClick={onEvcAttachmentSiteClick}
                      onRowClick={handleRowClick}
                    />
                  </Box>
                </>
              ) : null}
              <VpnBearerTable
                size="md"
                detailId={detailId}
                bearers={savedBearersWithStatus}
                onEditVpnBearerClick={onEditVpnBearerClick}
                onDeleteVpnBearerClick={handleDeleteButtonClick}
                onEvcAttachmentSiteClick={onEvcAttachmentSiteClick}
                onRowClick={handleRowClick}
              />
              <Box m="4">
                <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default VpnBearerList;
