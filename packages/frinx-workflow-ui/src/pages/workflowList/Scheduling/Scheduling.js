// @flow
import PageContainer from '../../../common/PageContainer';
import PageCount from '../../../common/PageCount';
import PageSelect from '../../../common/PageSelect';
import React, { useEffect, useState } from 'react';
import SchedulingModal from './SchedulingModal/SchedulingModal';
import callbackUtils from '../../../utils/callbackUtils';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Scheduling = () => {
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [activeRow, setActiveRow] = useState();
  const [pagesCount, setPagesCount] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState(undefined);
  const [defaultPages, setDefaultPages] = useState(20);
  const [viewedPage, setViewedPage] = useState(1);

  const refresh = () => {
    const getSchedules = callbackUtils.getSchedulesCallback();

    getSchedules()
      .then((res) => {
        if (Array.isArray(res)) {
          const dataset = [...res].sort((a, b) =>
            a.workflowName > b.workflowName ? 1 : b.workflowName > a.workflowName ? -1 : 0,
          );
          let size = Math.floor(dataset.length / defaultPages);
          setData(dataset);
          setPagesCount(dataset.length % defaultPages ? ++size : size);
          deselectActiveRow();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // do network request just once
    refresh();
  }, []);

  const deselectActiveRow = () => {
    setActiveRow(null);
  };

  const changeActiveRow = (i) => {
    const deselectingCurrentRow = activeRow == i;
    if (deselectingCurrentRow) {
      deselectActiveRow();
    } else {
      setActiveRow(i);
    }
  };

  const setCountPages = (defaultPages, pagesCount) => {
    setDefaultPages(defaultPages);
    setPagesCount(pagesCount);
    setViewedPage(1);
  };

  const deleteEntry = (schedulingEntry) => {
    const deleteSchedule = callbackUtils.deleteScheduleCallback();

    deleteSchedule(schedulingEntry.name).then((res) => {
      if (res && res.ok) {
        deselectActiveRow();
        refresh();
      } else {
        // TODO: display error in a box instead of alert
        const newError = 'Network error';
        setError(newError);
        alert(newError);
      }
    });
  };

  const flipShowSchedulingModal = () => {
    setShowSchedulingModal((s) => !s);
  };

  const onModalClose = () => {
    flipShowSchedulingModal();
    refresh();
  };

  const getActiveScheduleName = () => {
    console.log({ data, activeRow });
    if (activeRow != null && data[activeRow] != null) {
      return data[activeRow].name;
    }
    return null;
  };

  const getActiveWorkflowName = () => {
    if (activeRow != null && data[activeRow] != null) {
      return data[activeRow].workflowName;
    }
    return null;
  };

  const getActiveWorkflowVersion = () => {
    if (activeRow != null && data[activeRow] != null) {
      return data[activeRow].workflowVersion;
    }
    return null;
  };

  const getDataLength = () => {
    if (data != null) {
      return data.length;
    }
    return null;
  };

  const repeat = () => {
    const output = [];
    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        if (i >= (viewedPage - 1) * defaultPages && i < viewedPage * defaultPages) {
          output.push(
            <div className="wfRow" key={i}>
              <AccordionItem onClick={changeActiveRow.bind(this, i)}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <b>{data[i]['workflowName']}</b> v.{data[i]['workflowVersion']}
                      <br />
                      <div className="description">{data[i]['cronString']}</div>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel padding={0}>
                  <div
                    style={{
                      background: 'linear-gradient(-120deg, rgb(0, 147, 255) 0%, rgb(0, 118, 203) 100%)',
                      padding: '15px',
                      marginBottom: '10px',
                    }}
                  >
                    <Button variant="outline" color="white" colorScheme="whiteAlpha" onClick={flipShowSchedulingModal}>
                      Edit
                    </Button>
                    <IconButton
                      icon={<Icon as={FontAwesomeIcon} icon={faTrashAlt} />}
                      variant="outline"
                      float="right"
                      colorScheme="red"
                      onClick={deleteEntry.bind(this, data[i])}
                    />
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </div>,
          );
        }
      }
    }
    return output;
  };

  console.log(getActiveScheduleName());

  return (
    <PageContainer>
      <SchedulingModal
        name={getActiveScheduleName()}
        workflowName={getActiveWorkflowName()}
        workflowVersion={getActiveWorkflowVersion()}
        onClose={onModalClose}
        show={showSchedulingModal}
      />
      <Button variant="outline" size="sm" colorScheme="blue" onClick={() => refresh()} marginBottom={5}>
        <i className="fas fa-sync" />
        &nbsp;&nbsp;Refresh
      </Button>

      <div className="scrollWrapper" style={{ maxHeight: '650px' }}>
        <Table background="white">
          <Thead>
            <Tr>
              <Th>Name/Cron</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td padding={0}>
                <Accordion allowToggle activeKey={activeRow}>
                  {repeat()}
                </Accordion>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
      <Box marginTop={4}>
        <Flex justifyContent="space-between">
          <Box sm={2}>
            <PageCount dataSize={getDataLength()} defaultPages={defaultPages} handler={setCountPages.bind(this)} />
          </Box>
          <Box sm={2}>
            <PageSelect viewedPage={viewedPage} count={pagesCount} handler={setViewedPage} />
          </Box>
        </Flex>
      </Box>
    </PageContainer>
  );
};

export default Scheduling;
