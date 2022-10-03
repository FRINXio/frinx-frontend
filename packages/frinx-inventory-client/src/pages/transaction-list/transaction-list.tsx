import {
  Badge,
  Box,
  Code,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Progress,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import {
  CloseTransactionMutation,
  CloseTransactionMutationVariables,
  RevertChangesMutation,
  RevertChangesMutationVariables,
  TransactionsQuery,
  TransactionsQueryVariables,
} from '../../__generated__/graphql';
import { getTransactionData, removeTransactionData } from '../device-config/device-config.helpers';
import TransactionDiffModal from './transaction-diff-modal';

const TRANSACTIONS_QUERY = gql`
  query Transactions {
    transactions {
      transactionId
      lastCommitTime
      changes {
        device {
          id
          name
        }
        diff {
          path
          dataBefore
          dataAfter
        }
      }
    }
  }
`;
const REVERT_CHANGES_MUTATION = gql`
  mutation RevertChanges($transactionId: String!) {
    revertChanges(transactionId: $transactionId) {
      isOk
    }
  }
`;
const CLOSE_TRANSACTION_MUTATION = gql`
  mutation CloseTransactionList($deviceId: String!, $transactionId: String!) {
    closeTransaction(deviceId: $deviceId, transactionId: $transactionId) {
      isOk
    }
  }
`;

const TransactionList: VoidFunctionComponent = () => {
  const { addToastNotification } = useNotifications();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionsQuery['transactions'][0] | null>(null);
  const [{ data: transactionQData, fetching: isFetchingTransactions, error }] = useQuery<
    TransactionsQuery,
    TransactionsQueryVariables
  >({
    query: TRANSACTIONS_QUERY,
  });
  const [{ fetching: isMutationFetching }, revertChanges] = useMutation<
    RevertChangesMutation,
    RevertChangesMutationVariables
  >(REVERT_CHANGES_MUTATION);
  const [, closeTransaction] = useMutation<CloseTransactionMutation, CloseTransactionMutationVariables>(
    CLOSE_TRANSACTION_MUTATION,
  );

  if (isFetchingTransactions && transactionQData == null) {
    return (
      <Box position="relative">
        <Box position="absolute" top={0} right={0} left={0}>
          <Progress size="xs" isIndeterminate />
        </Box>
      </Box>
    );
  }

  if (transactionQData == null || error != null) {
    return null;
  }

  const handleRevertBtnClick = (transactionId: string) => {
    revertChanges({ transactionId }, { additionalTypenames: ['Transaction'] }).then((res) => {
      if (res.data?.revertChanges.isOk) {
        // we have to close current transaction to see reverted changes in UI
        const transactionData = getTransactionData();
        if (transactionData != null) {
          closeTransaction({ deviceId: transactionData.deviceId, transactionId: transactionData.transactionId }).then(
            () => {
              removeTransactionData();
            },
          );
        }
        addToastNotification({
          type: 'success',
          content: 'Transaction successfully reverted',
          title: 'Success',
        });
      }
      if (!res.data?.revertChanges.isOk || res.error != null) {
        addToastNotification({
          type: 'error',
          content: 'There was an error reverting transaction',
          title: 'Error',
        });
      }
      setSelectedTransaction(null);
    });
  };

  return (
    <>
      {selectedTransaction != null && (
        <TransactionDiffModal
          changes={selectedTransaction.changes}
          isLoading={isMutationFetching}
          onClose={() => {
            setSelectedTransaction(null);
          }}
          onRevertBtnClick={() => {
            handleRevertBtnClick(selectedTransaction.transactionId);
          }}
        />
      )}
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="3xl">
            Transactions
          </Heading>
        </Flex>
        <Box>
          <Table background="white" size="lg">
            <Thead>
              <Tr>
                <Th>Transaction id</Th>
                <Th>Last commit time</Th>
                <Th>Devices</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionQData.transactions.map((transaction) => {
                return (
                  <Tr key={transaction.transactionId}>
                    <Td>
                      <Code>{transaction.transactionId}</Code>
                    </Td>
                    <Td>
                      {format(
                        utcToZonedTime(transaction.lastCommitTime, Intl.DateTimeFormat().resolvedOptions().timeZone),
                        'dd/MM/yyyy, k:mm',
                      )}
                    </Td>
                    <Td>
                      {transaction.changes.map((c) => {
                        return (
                          <Badge
                            key={c.device.id}
                            as={Link}
                            to={`../config/${c.device.id}`}
                            _hover={{
                              background: 'gray.300',
                            }}
                          >
                            {c.device.name}
                          </Badge>
                        );
                      })}
                    </Td>
                    <Td>
                      <Tooltip label="Revert">
                        <IconButton
                          colorScheme="blue"
                          size="sm"
                          aria-label="Revert"
                          isLoading={isMutationFetching}
                          icon={<Icon as={FeatherIcon} icon="rotate-ccw" size={20} />}
                          onClick={() => {
                            setSelectedTransaction(transaction);
                          }}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </>
  );
};

export default TransactionList;
