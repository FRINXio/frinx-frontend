import { Container, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { omitNullValue } from '@frinx/shared';
import moment from 'moment';
import React from 'react';
import { gql, useQuery } from 'urql';
import { PollDataQuery, PollDataQueryVariables } from '../../__generated__/graphql';

// type Filter = {
//   queueName?: string;
//   workerId?: string;
//   domain?: string;
//   beforeDate?: string;
//   afterDate?: string;
// };

const POLL_DATA_QUERY = gql`
  query PollData {
    conductor {
      getAllPollData {
        queueName
        domain
        workerId
        lastPollTime
      }
    }
  }
`;

// const getISODateString = (dateString: string | undefined): string | undefined => {
//   if (dateString === undefined) {
//     return undefined;
//   }
//   const dateObj = new Date(dateString);
//   if (Number.isNaN(dateObj.getTime())) {
//     return undefined;
//   }
//   return dateObj.toISOString();
// };

// const initialValues = {
//   queueName: '',
//   workerId: '',
//   domain: '',
//   beforeDate: undefined,
//   afterDate: undefined,
// };

const PollDataPage = () => {
  // const [orderBy, setOrderBy] = useState<PollsOrderByInput>({ sortKey: 'queueName', direction: 'asc' });
  // const [filter, setFilter] = useState<Filter | null>(initialValues);
  // const [inputs, setInputs] = useState<Filter>(initialValues);

  // const { isOpen, onToggle } = useDisclosure();
  // const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data: pollData }] = useQuery<PollDataQuery, PollDataQueryVariables>({
    query: POLL_DATA_QUERY,
    requestPolicy: 'cache-and-network',
  });

  const pollDataNodes = (pollData?.conductor.getAllPollData ?? [])
    .map((e) => {
      return e ?? null;
    })
    .filter(omitNullValue);

  // const filterPollData = () => {
  //   setFilter({
  //     ...inputs,
  //     beforeDate: getISODateString(inputs.beforeDate),
  //     afterDate: getISODateString(inputs.afterDate),
  //   });
  // };

  // const resetFilter = () => {
  //   setFilter(initialValues);
  //   setInputs(initialValues);
  // };

  // const sort = (sortKey: 'queueName' | 'workerId' | 'lastPollTime') => {
  //   return orderBy.direction === 'desc'
  //     ? setOrderBy({ sortKey, direction: 'asc' })
  //     : setOrderBy({ sortKey, direction: 'desc' });
  // };

  return (
    <Container maxWidth={1200} mx="auto">
      {/* <PollDataSearchbox
        inputs={inputs}
        setInputs={setInputs}
        filterPollData={filterPollData}
        resetFilter={resetFilter}
        onToggle={onToggle}
        isOpen={isOpen}
      /> */}
      <Table background="white">
        <Thead>
          <Tr>
            <Th cursor="pointer">
              Name (Domain)
              {/* {orderBy.sortKey === 'queueName' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
              )} */}
            </Th>
            <Th cursor="pointer" textAlign="center">
              Last Poll Time
              {/* {orderBy.sortKey === 'lastPollTime' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
              )} */}
            </Th>
            <Th cursor="pointer" textAlign="center">
              Last Polled By
              {/* {orderBy.sortKey === 'workerId' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'asc' ? 'chevron-down' : 'chevron-up'} />
              )} */}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {pollDataNodes.map((e, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Tr key={`${index}-${e.workerId}`}>
                <Td>{e.queueName}</Td>
                <Td textAlign="center">
                  {e.lastPollTime ? moment(e.lastPollTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}
                </Td>
                <Td textAlign="center">{e.workerId}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* {pollData?.pollData?.pageInfo && (
        <Pagination
          onPrevious={previousPage(pollData.pollData.pageInfo.startCursor)}
          onNext={nextPage(pollData.pollData.pageInfo.endCursor)}
          hasNextPage={pollData.pollData.pageInfo.hasNextPage}
          hasPreviousPage={pollData.pollData.pageInfo.hasPreviousPage}
        />
      )} */}
    </Container>
  );
};

export default PollDataPage;
