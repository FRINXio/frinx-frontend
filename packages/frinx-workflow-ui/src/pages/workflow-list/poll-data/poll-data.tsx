import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  Container,
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
} from '@chakra-ui/react';
import { sortDescBy, sortAscBy } from '@frinx/workflow-ui/src/utils/helpers.utils';
import FeatherIcon from 'feather-icons-react';
import { usePagination } from '../../../common/pagination-hook';
import { Queue } from '../../../helpers/uniflow-types';
import callbackUtils from '../../../utils/callback-utils';
import Paginator from '../../../common/pagination';

function filterBySearchKeyword(queue: Queue, keyword: string): boolean {
  const query = keyword.toUpperCase();
  const worfklowName = queue.queueName.toUpperCase();
  const searchedKeys = Object.keys(queue);

  return searchedKeys.some((k) => {
    if (k === 'lastPollTime') {
      return moment(queue[k])
        .format('MM/DD/YYYY, HH:mm:ss:SSS')
        .toString()
        .toLowerCase()
        .includes(query.toLocaleLowerCase());
    }
    return worfklowName.includes(query);
  });
}

const PollData = () => {
  const [sorted, setSorted] = useState(false);
  const [data, setData] = useState<Queue[]>([]);
  const [keywords, setKeywords] = useState('');
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<Queue>();

  useEffect(() => {
    const { getQueues } = callbackUtils.getCallbacks;

    getQueues().then((queues) => {
      setData(queues);
    });
  }, []);

  useEffect(() => {
    const results = !keywords ? data : data.filter((q) => filterBySearchKeyword(q, keywords));

    setItemList(results);
  }, [keywords, data, setItemList]);

  const sortArray = (key: string) => {
    const sortedArray = data;

    sortedArray.sort(sorted ? sortDescBy(key) : sortAscBy(key));
    setSorted(!sorted);
    setData(sortedArray);
  };

  const pollTable = () => {
    return (
      <Table background="white">
        <Thead>
          <Tr>
            <Th onClick={() => sortArray('queueName')}>Name (Domain)</Th>
            <Th textAlign="center" onClick={() => sortArray('qsize')}>
              Size
            </Th>
            <Th textAlign="center" onClick={() => sortArray('lastPollTime')}>
              Last Poll Time
            </Th>
            <Th textAlign="center" onClick={() => sortArray('workerId')}>
              Last Polled By
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {pageItems.map((e) => {
            return (
              <Tr key={e.queueName}>
                <Td>{e.queueName}</Td>
                <Td textAlign="center">{e.qsize}</Td>
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
              <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    );
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <InputGroup marginBottom={8}>
        <InputLeftElement>
          <Icon size={20} as={FeatherIcon} icon="search" color="grey" />
        </InputLeftElement>
        <Input
          value={keywords}
          placeholder="Search..."
          onChange={(e) => setKeywords(e.target.value)}
          background="white"
        />
      </InputGroup>
      {pollTable()}
    </Container>
  );
};

export default PollData;
