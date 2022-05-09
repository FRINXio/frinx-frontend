import { Box, Button, Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import diff from 'diff-arrays-of-objects';
import React, { useContext, useEffect, useState, VoidFunctionComponent } from 'react';
import { Link, useParams } from 'react-router-dom';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import {
  apiBearerToClientBearer,
  apiEvcAttachmentsToClientEvcAttachments,
  clientBearerToApiBearer,
} from '../../components/forms/converters';
import Pagination from '../../components/pagination/pagination';
import FilterContext from '../../filter-provider';
import unwrap from '../../helpers/unwrap';
import usePagination from '../../hooks/use-pagination';
import callbackUtils from '../../unistore-callback-utils';
import EvcFilter, { EvcFilters } from './evc-filter';
import { getChangedEvcAttachmentsWithStatus, getSavedEvcAttachmentsWithStatus } from './evc-helpers';
import EvcTable from './evc-table';

const EvcListPage: VoidFunctionComponent = () => {
  const filterContext = useContext(FilterContext);
  const { evc: evcFilters, onEvcFilterChange } = unwrap(filterContext);
  const [createdEvcAttachments, setCreatedEvcAttachments] = useState<EvcAttachment[] | null>(null);
  const [updatedEvcAttachments, setUpdatedEvcAttachments] = useState<EvcAttachment[] | null>(null);
  const [deletedEvcAttachments, setDeletedEvcAttachments] = useState<EvcAttachment[] | null>(null);
  const [bearer, setBearer] = useState<VpnBearer | null>(null);
  const [evcAttachments, setEvcAttachments] = useState<EvcAttachment[] | null>(null);
  const [evcToDelete, setEvcToDelete] = useState<Pick<EvcAttachment, 'evcType' | 'circuitReference'> | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { bearerId } = useParams<{ bearerId: string }>();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<EvcFilters>(evcFilters);
  const [submittedFilters, setSubmittedFilters] = useState(evcFilters);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const apiBearers = await callbacks.getVpnBearers(null, null);
      const clientVpnBearers = apiBearerToClientBearer(apiBearers);
      const [selectedVpnBearer] = clientVpnBearers.filter((b) => b.spBearerReference === bearerId);
      setBearer(selectedVpnBearer);
    };

    fetchData();
  }, [bearerId]);

  useEffect(() => {
    const fetchData = async () => {
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const callbacks = callbackUtils.getCallbacks;
      const apiEvcAttachments = await callbacks.getEvcAttachments(
        unwrap(bearerId),
        paginationParams,
        submittedFilters,
        'nonconfig',
      );
      const clientEvcAttachments = apiEvcAttachmentsToClientEvcAttachments(apiEvcAttachments);
      setEvcAttachments(clientEvcAttachments);
      const evcCount = await callbacks.getEvcAttachmentsCount(unwrap(bearerId), submittedFilters, 'nonconfig');
      setPagination({
        ...pagination,
        pageCount: Math.ceil(evcCount / pagination.pageSize),
      });

      // get data for changes table
      const allSavedEvcAttachments = await callbacks.getEvcAttachments(unwrap(bearerId), null, null, 'nonconfig');
      const clientAllEvcAttachments = apiEvcAttachmentsToClientEvcAttachments(allSavedEvcAttachments);
      const allUnsavedEvcAttachments = await callbacks.getEvcAttachments(unwrap(bearerId), null, null);
      const clientAllUnsavedEvcAttachments = apiEvcAttachmentsToClientEvcAttachments(allUnsavedEvcAttachments);
      const result = diff(clientAllEvcAttachments, clientAllUnsavedEvcAttachments, 'circuitReference');
      setCreatedEvcAttachments(result.added);
      setUpdatedEvcAttachments(result.updated);
      setDeletedEvcAttachments(result.removed);
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteButtonClick = (evcType: string, circuitReference: string) => {
    setEvcToDelete({
      evcType,
      circuitReference,
    });
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

  const handleFilterChange = (newFilters: EvcFilters) => {
    setFilters({
      ...newFilters,
    });
  };

  const handleFilterReset = (newFilters: EvcFilters) => {
    setPagination({
      ...pagination,
      page: 1,
    });
    const resetFilters = { ...newFilters };
    setFilters(resetFilters);
    setSubmittedFilters(resetFilters);
    onEvcFilterChange(resetFilters);
  };

  const handleFilterSubmit = () => {
    setPagination({
      ...pagination,
      page: 1,
    });
    setSubmittedFilters(filters);
  };

  if (!bearer) {
    return null;
  }

  const changedEvcAttachmentsWithStatus = getChangedEvcAttachmentsWithStatus(
    createdEvcAttachments,
    updatedEvcAttachments,
    deletedEvcAttachments,
  );
  const savedEvcAttachmentsWithStatus = getSavedEvcAttachmentsWithStatus(
    evcAttachments,
    updatedEvcAttachments,
    deletedEvcAttachments,
  );

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          const editedVpnBearer: VpnBearer = {
            ...bearer,
            evcAttachments: bearer.evcAttachments.filter(
              (e) => !(e.evcType === evcToDelete?.evcType && e.circuitReference === evcToDelete?.circuitReference),
            ),
          };
          const apiBearer = clientBearerToApiBearer(editedVpnBearer);
          callbackUtils.getCallbacks.editVpnBearer(apiBearer).then(() => {
            setBearer(editedVpnBearer);
            setCreatedEvcAttachments(
              unwrap(createdEvcAttachments).filter(
                (evc) => evc.evcType !== evcToDelete?.evcType && evc.circuitReference !== evcToDelete?.circuitReference,
              ),
            );
            setUpdatedEvcAttachments(
              unwrap(updatedEvcAttachments).filter(
                (evc) => evc.evcType !== evcToDelete?.evcType && evc.circuitReference !== evcToDelete?.circuitReference,
              ),
            );
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete evc attachment"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            EVC Attachments (Bearer: {bearer.spBearerReference})
          </Heading>
          <Button colorScheme="blue" as={Link} to={`../vpn-bearers/${bearerId}/evc-attachments/add`}>
            Add Evc Attachment
          </Button>
        </Flex>
        <Box>
          <EvcFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onFilterReset={handleFilterReset}
            onFilterSubmit={handleFilterSubmit}
          />
          {changedEvcAttachmentsWithStatus.length ? (
            <>
              <Heading size="sm">Changes</Heading>
              <Box my="2">
                <EvcTable
                  size="sm"
                  bearer={bearer}
                  evcAttachments={changedEvcAttachmentsWithStatus}
                  detailId={detailId}
                  onDeleteEvcButtonClick={handleDeleteButtonClick}
                  onRowClick={handleRowClick}
                />
              </Box>
            </>
          ) : null}
          <EvcTable
            size="md"
            bearer={bearer}
            evcAttachments={savedEvcAttachmentsWithStatus}
            detailId={detailId}
            onDeleteEvcButtonClick={handleDeleteButtonClick}
            onRowClick={handleRowClick}
          />
          <Box m="4">
            <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
          </Box>
        </Box>
        <Box py={6}>
          <Button as={Link} to="../vpn-bearers" colorScheme="blue">
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EvcListPage;
