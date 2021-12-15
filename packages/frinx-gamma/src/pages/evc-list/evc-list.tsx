import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useDisclosure, Heading, Box, Container, Flex, Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import {
  apiBearerToClientBearer,
  clientBearerToApiBearer,
  apiEvcAttachmentsToClientEvcAttachments,
} from '../../components/forms/converters';
import EvcTable from './evc-table';
import { EvcAttachment, VpnBearer } from '../../components/forms/bearer-types';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import callbackUtils from '../../unistore-callback-utils';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import EvcFilter, { getDefaultEvcFilters, EvcFilters } from './evc-filter';

type Props = {
  onCreateEvcClick: (bearerId: string) => void;
  onEditEvcClick: (bearerId: string, evcType: string, circuitReference: string) => void;
  onBearerListClick: () => void;
};

const EvcListPage: VoidFunctionComponent<Props> = ({ onCreateEvcClick, onEditEvcClick, onBearerListClick }) => {
  const [bearer, setBearer] = useState<VpnBearer | null>(null);
  const [evcAttachments, setEvcAttachments] = useState<EvcAttachment[] | null>(null);
  const [evcToDelete, setEvcToDelete] = useState<Pick<EvcAttachment, 'evcType' | 'circuitReference'> | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { bearerId } = useParams<{ bearerId: string }>();
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<EvcFilters>(getDefaultEvcFilters());
  const [submittedFilters, setSubmittedFilters] = useState<EvcFilters>(getDefaultEvcFilters());

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
      const apiEvcAttachments = await callbacks.getEvcAttachments(bearerId, paginationParams, submittedFilters);
      const clientEvcAttachments = apiEvcAttachmentsToClientEvcAttachments(apiEvcAttachments);
      setEvcAttachments(clientEvcAttachments);
      const evcCount = await callbacks.getEvcAttachmentsCount(bearerId, submittedFilters);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(evcCount / pagination.pageSize),
      });
    };
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteButtonClick(evcType: string, circuitReference: string) {
    setEvcToDelete({
      evcType,
      circuitReference,
    });
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

  function handleFilterChange(newFilters: EvcFilters) {
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

  if (!bearer) {
    return null;
  }

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
            Evc Attachments (Bearer: {bearer.spBearerReference})
          </Heading>
          <Button colorScheme="blue" onClick={() => onCreateEvcClick(bearer.spBearerReference)}>
            Add Evc Attachment
          </Button>
        </Flex>
        <Box>
          <EvcFilter filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} />
          <EvcTable
            bearer={bearer}
            evcAttachments={evcAttachments || []}
            detailId={detailId}
            onEditEvcButtonClick={onEditEvcClick}
            onDeleteEvcButtonClick={handleDeleteButtonClick}
            onRowClick={handleRowClick}
          />
          <Box m="4">
            <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
          </Box>
        </Box>
        <Box py={6}>
          <Button onClick={() => onBearerListClick()} colorScheme="blue">
            Back to list
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EvcListPage;
