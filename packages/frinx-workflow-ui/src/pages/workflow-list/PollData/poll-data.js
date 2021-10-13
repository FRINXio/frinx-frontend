// @flow
import PageContainer from '../../../common/PageContainer';
import PaginationPages from '../../../common/Pagination';
import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../utils/callback-utils';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, Input, InputGroup, InputLeftElement, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { sortAscBy, sortDescBy } from '../workflowUtils';
import { usePagination } from '../../../common/PaginationHook';

const PollData = () => {
  const [sorted, setSorted] = useState(false);
  const [data, setData] = useState([]);
  const [keywords, setKeywords] = useState('');
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination([], 10);

  useEffect(() => {
    const getQueues = callbackUtils.getQueuesCallback();

    getQueues().then((queues) => {
      setData(queues);
    });
  }, []);

  useEffect(() => {
    const results = !keywords
      ? data
      : data.filter((e) => {
          const searchedKeys = ['queueName', 'qsize', 'lastPollTime', 'workerId'];

          for (let i = 0; i < searchedKeys.length; i += 1) {
            if (searchedKeys[i] === 'lastPollTime') {
              if (
                moment(e[searchedKeys[i]])
                  .format('MM/DD/YYYY, HH:mm:ss:SSS')
                  .toString()
                  .toLowerCase()
                  .includes(keywords.toLocaleLowerCase())
              ) {
                return true;
              }
            }
            if (e[searchedKeys[i]].toString().toLowerCase().includes(keywords.toLocaleLowerCase())) {
              return true;
            }
          }
          return false;
        });
    setItemList(results);
  }, [keywords, data]);

  const sortArray = (key) => {
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
            console.log(e);
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
              <PaginationPages totalPages={totalPages} currentPage={currentPage} changePageHandler={setCurrentPage} />
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
