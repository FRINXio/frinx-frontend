import { Box, Button, Container, Flex, Heading, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import ConfirmDeleteModal from '../../components/confirm-delete-modal/confirm-delete-modal';
import { VpnBearer } from '../../components/forms/bearer-types';
import { apiBearerToClientBearer } from '../../components/forms/converters';
import unwrap from '../../helpers/unwrap';
import VpnBearerTable from './vpn-bearer-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';

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
  const [vpnBearers, setVpnBearers] = useState<VpnBearer[] | null>(null);
  const [bearerIdToDelete, setBearerIdToDelete] = useState<string | null>(null);
  const deleteModalDisclosure = useDisclosure();
  const [pagination, setPagination] = usePagination();

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const paginationParams = {
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
      const response = await callbacks.getVpnBearers(paginationParams);
      const clientVpnBearers = apiBearerToClientBearer(response);
      setVpnBearers(clientVpnBearers);
      const bearersCount = await callbacks.getVpnBearerCount();
      setPagination({
        ...pagination,
        pageCount: Math.ceil(bearersCount / pagination.pageSize),
      });
    };

    fetchData();
  }, [pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <VpnBearerTable
                bearers={vpnBearers}
                onEditVpnBearerClick={onEditVpnBearerClick}
                onDeleteVpnBearerClick={handleDeleteButtonClick}
                onEvcAttachmentSiteClick={onEvcAttachmentSiteClick}
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
