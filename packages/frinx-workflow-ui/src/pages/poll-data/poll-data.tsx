import { Box, Container, Icon, Table, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { omitNullValue, Pagination } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import moment from 'moment';
import React, { useState } from 'react';
import { gql, useQuery } from 'urql';
import PollDataSearchbox from '../../components/poll-data-searchbox';
import { usePagination } from '../../hooks/use-graphql-pagination';
import { PollDataQuery, PollDataQueryVariables, PollsOrderByInput } from '../../__generated__/graphql';

type Filter = {
  queueName?: string;
  workerId?: string;
  domain?: string;
  beforeDate?: string;
  afterDate?: string;
};

const POLL_DATA_QUERY = gql`
  query PollData(
    $filter: FilterPollDataInput
    $orderBy: PollsOrderByInput!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    pollData(filter: $filter, orderBy: $orderBy, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      edges {
        cursor
        node {
          id
          queueName
          workerId
          domain
          lastPollTime
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const getISODateString = (dateString: string | undefined): string | undefined => {
  if (dateString === undefined) {
    return undefined;
  }
  const dateObj = new Date(dateString);
  if (Number.isNaN(dateObj.getTime())) {
    return undefined;
  }
  return dateObj.toISOString();
};

const initialValues = {
  queueName: '',
  workerId: '',
  domain: '',
  beforeDate: undefined,
  afterDate: undefined,
};

const PollDataPage = () => {
  const [orderBy, setOrderBy] = useState<PollsOrderByInput>({ sortKey: 'queueName', direction: 'asc' });
  const [filter, setFilter] = useState<Filter | null>(initialValues);
  const [inputs, setInputs] = useState<Filter>(initialValues);

  const { isOpen, onToggle } = useDisclosure();
  const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data: pollData }] = useQuery<PollDataQuery, PollDataQueryVariables>({
    query: POLL_DATA_QUERY,
    variables: {
      ...paginationArgs,
      filter,
      orderBy,
    },
  });

  const pollDataNodes = (pollData?.pollData?.edges ?? [])
    .map((e) => {
      return e?.node ?? null;
    })
    .filter(omitNullValue);

  const filterPollData = () => {
    setFilter({
      ...inputs,
      beforeDate: getISODateString(inputs.beforeDate),
      afterDate: getISODateString(inputs.afterDate),
    });
  };

  const resetFilter = () => {
    setFilter(initialValues);
    setInputs(initialValues);
  };

  const sort = (sortKey: 'queueName' | 'workerId' | 'lastPollTime') => {
    return orderBy.direction === 'desc'
      ? setOrderBy({ sortKey, direction: 'asc' })
      : setOrderBy({ sortKey, direction: 'desc' });
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <PollDataSearchbox
        inputs={inputs}
        setInputs={setInputs}
        filterPollData={filterPollData}
        resetFilter={resetFilter}
        onToggle={onToggle}
        isOpen={isOpen}
      />
      <Table background="white">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => sort('queueName')}>
              Name (Domain)
              {orderBy.sortKey === 'queueName' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Th>
            <Th cursor="pointer" textAlign="center" onClick={() => sort('lastPollTime')}>
              Last Poll Time
              {orderBy.sortKey === 'lastPollTime' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Th>
            <Th cursor="pointer" textAlign="center" onClick={() => sort('workerId')}>
              Last Polled By
              {orderBy.sortKey === 'workerId' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {pollDataNodes.map((e) => {
            return (
              <Tr key={e.id}>
                <Td>{e.queueName}</Td>
                <Td textAlign="center">
                  {e.lastPollTime ? moment(e.lastPollTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}
                </Td>
                <Td textAlign="center">{e.workerId}</Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>
              {pollData?.pollData?.pageInfo && (
                <Box marginTop={4} paddingX={4}>
                  <Pagination
                    onPrevious={previousPage(pollData.pollData.pageInfo.startCursor)}
                    onNext={nextPage(pollData.pollData.pageInfo.endCursor)}
                    hasNextPage={pollData.pollData.pageInfo.hasNextPage}
                    hasPreviousPage={pollData.pollData.pageInfo.hasPreviousPage}
                  />
                </Box>
              )}
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </Container>
  );
};

export default PollDataPage;
