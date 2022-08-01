// @flow
import PageContainer from '../../../common/PageContainer';
import Paginator from '../../../common/pagination';
import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../utils/callback-utils';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, Input, InputGroup, InputLeftElement, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { sortAscBy, sortDescBy } from '../workflowUtils';
import { usePagination } from '../../../common/pagination-hook';
import { Queue } from '../../../helpers/uniflow-types';

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
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<Queue>([], 10);

  useEffect(() => {
    const { getQueues } = callbackUtils.getCallbacks;

    getQueues().then((queues: Queue[]) => {
      setData(queues);
    });
  }, []);

  useEffect(() => {
    const results = !keywords ? data : data.filter((q) => filterBySearchKeyword(q, keywords));

    setItemList(results);
  }, [keywords, data]);

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
          {pageItems.map((e: any) => {
            // console.log(e);
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
    <PageContainer>
      <InputGroup marginBottom={8}>
        <InputLeftElement>
          <Icon as={FontAwesomeIcon} icon={faSearch} color="grey" />
        </InputLeftElement>
        <Input
          value={keywords}
          placeholder="Search..."
          onChange={(e) => setKeywords(e.target.value)}
          background="white"
        />
      </InputGroup>
      {pollTable()}
    </PageContainer>
  );
};

export default PollData;
