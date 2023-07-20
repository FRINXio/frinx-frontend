import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { omitNullValue, Pagination } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import moment from 'moment';
import React, { useState } from 'react';
import { gql, useQuery } from 'urql';
import { usePagination } from '../../hooks/use-graphql-pagination';
import { PollDataQuery, PollDataQueryVariables } from '../../__generated__/graphql';

type Filter = {
  queueName?: string;
  workerId?: string;
  domain?: string;
  beforeDate?: string;
  afterDate?: string;
};

type SortBy = {
  key: string;
  order: 'asc' | 'desc';
};

const POLL_DATA_QUERY = gql`
  query PollData(
    $filter: FilterPollDataInput
    $sortBy: SortDataInput!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    pollData(filter: $filter, sortBy: $sortBy, first: $first, after: $after, last: $last, before: $before) {
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

const PollDataPage = () => {
  const [sortBy, setSortBy] = useState<SortBy>({ key: 'lastPollTime', order: 'asc' });
  const [filter, setFilter] = useState<Filter>({});
  const [inputs, setInputs] = useState({
    queueName: '',
    workerId: '',
    domain: '',
    beforeDate: '' as string | undefined,
    afterDate: '' as string | undefined,
  });

  const { isOpen, onToggle } = useDisclosure();
  const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data: pollData }] = useQuery<PollDataQuery, PollDataQueryVariables>({
    query: POLL_DATA_QUERY,
    variables: {
      ...paginationArgs,
      filter,
      sortBy,
    },
  });

  const pollDataNodes = (pollData?.pollData?.edges ?? [])
    .map((e) => {
      return e?.node ?? null;
    })
    .filter(omitNullValue);

  function getISODateString(dateString: string | undefined): string | undefined {
    if (dateString === undefined) {
      return undefined;
    }
    const dateObj = new Date(dateString);
    if (Number.isNaN(dateObj.getTime())) {
      return undefined;
    }
    return dateObj.toISOString();
  }

  const filterPollData = () => {
    setFilter({
      ...inputs,
      beforeDate: getISODateString(inputs.beforeDate),
      afterDate: getISODateString(inputs.afterDate),
    });
  };

  const resetFilter = () => {
    setFilter({});
    setInputs({
      queueName: '',
      workerId: '',
      domain: '',
      beforeDate: undefined,
      afterDate: undefined,
    });
  };

  const sort = (key: string) => {
    return sortBy.order === 'desc' ? setSortBy({ key, order: 'asc' }) : setSortBy({ key, order: 'desc' });
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <Flex justify="space-between" mb={8}>
        <Flex>
          <FormControl width={250} ml={2}>
            <FormLabel>Search by queueName</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <Icon size={20} as={FeatherIcon} icon="search" color="grey" />
              </InputLeftElement>
              <Input
                value={inputs.queueName}
                placeholder="Search by name"
                onChange={(e) => setInputs((prev) => ({ ...prev, queueName: e.target.value }))}
                background="white"
              />
            </InputGroup>
          </FormControl>
          <FormControl width={250} ml={2}>
            <FormLabel>Poll time - before</FormLabel>
            <Input
              background="white"
              name="from"
              value={inputs.beforeDate || ''}
              onChange={(e) => setInputs((prev) => ({ ...prev, beforeDate: e.target.value || undefined }))}
              type="datetime-local"
            />
          </FormControl>

          <FormControl ml={2} width={250}>
            <FormLabel>Poll time - after</FormLabel>
            <Input
              background="white"
              name="to"
              value={inputs.afterDate || ''}
              onChange={(e) => setInputs((prev) => ({ ...prev, afterDate: e.target.value || undefined }))}
              type="datetime-local"
            />
          </FormControl>
        </Flex>
        <Flex align="flex-end">
          <Button data-cy="filter-poll-data" onClick={filterPollData} colorScheme="blue">
            Search
          </Button>
          <Button ml={2} data-cy="filter-poll-data" onClick={resetFilter} colorScheme="red" variant="outline">
            Reset
          </Button>
        </Flex>
      </Flex>
      <HStack my={3}>
        <Divider />
        <HStack cursor="pointer" textColor="gray.500" onClick={onToggle}>
          <Text data-cy="device-state-advanced-options" width="max-content">
            Advanced options
          </Text>
          {isOpen ? <FeatherIcon icon="chevron-up" size={20} /> : <FeatherIcon icon="chevron-down" size={20} />}
        </HStack>
        <Divider />
      </HStack>
      {isOpen && (
        <Flex mb={8}>
          <FormControl width={250} ml={2}>
            <FormLabel>Search by domain</FormLabel>

            <Input
              value={inputs.domain}
              placeholder="Search by domain"
              onChange={(e) => setInputs((prev) => ({ ...prev, domain: e.target.value }))}
              background="white"
            />
          </FormControl>
          <FormControl width={250} ml={2}>
            <FormLabel>Last polled by - workerId</FormLabel>

            <Input
              value={inputs.workerId}
              placeholder="Search by workerId"
              onChange={(e) => setInputs((prev) => ({ ...prev, workerId: e.target.value }))}
              background="white"
            />
          </FormControl>
        </Flex>
      )}
      <Table background="white">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => sort('queueName')}>
              Name (Domain)
            </Th>
            <Th cursor="pointer" textAlign="center" onClick={() => sort('lastPollTime')}>
              Last Poll Time
            </Th>
            <Th cursor="pointer" textAlign="center" onClick={() => sort('workerId')}>
              Last Polled By
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
