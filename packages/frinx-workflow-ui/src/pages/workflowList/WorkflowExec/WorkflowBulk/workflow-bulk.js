// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import * as bulkActions from '../../../../store/actions/bulk';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Progress,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

class WorkflowBulk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBulk: null,
    };
  }

  performOperation(e) {
    const { performBulkOperation, selectedWfs } = this.props;

    if (_.isEmpty(selectedWfs)) {
      return;
    }

    const operation = e.target.value;
    performBulkOperation(operation, selectedWfs, this.props.pageCount);
    this.props.bulkOperation();
    this.props.selectAllWfs();
  }

  render() {
    const { selectedWfs, bulkReducer, wfsCount } = this.props;

    const progressInstance = (
      <Progress marginTop={5} width="100%" colorScheme="blue" value={bulkReducer.loading} max={100} size="sm" />
    );

    return (
      <Accordion allowToggle marginBottom={4} backgroundColor="white">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Bulk Processing (click to expand)&nbsp;&nbsp;
                <Icon as={FontAwesomeIcon} icon={faEllipsisH} />
                &nbsp;&nbsp; Displaying <b>{wfsCount}</b> workflows
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel padding={8}>
            <Flex justifyContent="space-between">
              <Box>
                <Heading as="h5" size="sm">
                  Workflows selected: {selectedWfs.length}
                  {bulkReducer.isFetching ? (
                    <Spinner color="brand.500" size="md" marginLeft={8} float="right" marginRight={40} />
                  ) : null}
                  {!bulkReducer.isFetching ? (
                    bulkReducer.successfulResults.length > 0 &&
                    Object.entries(bulkReducer.errorResults).length === 0 ? (
                      <i
                        style={{
                          float: 'right',
                          marginRight: '40px',
                          color: 'green',
                        }}
                        className="fas fa-check-circle fa-2x"
                      />
                    ) : Object.entries(bulkReducer.errorResults).length > 0 ? (
                      <i
                        style={{
                          float: 'right',
                          marginRight: '40px',
                          color: '#dc3545',
                        }}
                        className="fas fa-times-circle fa-2x"
                      />
                    ) : null
                  ) : null}
                </Heading>
                <Flex alignItems="center" marginTop={8}>
                  <Button
                    size="sm"
                    variant="outline"
                    marginRight={8}
                    colorScheme="gray"
                    onClick={this.props.selectAllWfs}
                  >
                    {selectedWfs.length > 0 ? 'Uncheck all' : 'Check all'}
                  </Button>
                  <Text>Select workflows from table below</Text>
                </Flex>
              </Box>
              <Stack spacing={4} direction="row">
                <Button variant="outline" value="pause" colorScheme="blue" onClick={(e) => this.performOperation(e)}>
                  Pause
                </Button>
                <Button variant="outline" value="resume" colorScheme="blue" onClick={(e) => this.performOperation(e)}>
                  Resume
                </Button>
                <Button variant="outline" value="retry" colorScheme="blue" onClick={(e) => this.performOperation(e)}>
                  Retry
                </Button>
                <Button variant="outline" value="restart" colorScheme="blue" onClick={(e) => this.performOperation(e)}>
                  Restart
                </Button>
                <Button variant="outline" value="terminate" colorScheme="red" onClick={(e) => this.performOperation(e)}>
                  Terminate
                </Button>
                <Button variant="outline" value="delete" colorScheme="gray" onClick={(e) => this.performOperation(e)}>
                  Delete
                </Button>
              </Stack>
            </Flex>
            <Flex>{bulkReducer.loading === 0 ? null : progressInstance}</Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bulkReducer: state.bulkReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    performBulkOperation: (operation, wfs, defaultPages) =>
      dispatch(bulkActions.performBulkOperation(operation, wfs, defaultPages)),
    setView: (value) => dispatch(bulkActions.setView(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowBulk);
