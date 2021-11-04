import React, { FC } from 'react';
import { ButtonGroup, Button, Box, Flex, FormControl, Grid, Input, Text } from '@chakra-ui/react';
import WfAutoComplete from '../../../../common/wf-autocomplete';

type Props = {
  showFlat: boolean;
  labels: string[];
  query: string;
  changeLabels: (e: string[]) => void;
  changeView: () => void;
  changeQuery: (e: string) => void;
};

const ExecutedWorkflowSearchBox: FC<Props> = ({ changeLabels, changeQuery, changeView, showFlat, labels, query }) => {
  return (
    <>
      <Flex alignItems="center" marginBottom={4}>
        <Text marginRight={4}>Workflow view</Text>

        <ButtonGroup size="sm" isAttached colorScheme="blue" onChange={changeView}>
          <Button variant={showFlat ? 'outline' : 'solid'} onClick={() => (showFlat ? changeView() : null)}>
            Hierarchy
          </Button>
          <Button variant={showFlat ? 'solid' : 'outline'} onClick={() => (showFlat ? null : changeView())}>
            Flat
          </Button>
        </ButtonGroup>
      </Flex>

      <Grid templateColumns="1fr 1fr 40px" gap={4} marginBottom={8}>
        <Box flexGrow={1}>
          <WfAutoComplete
            options={['RUNNING', 'COMPLETED', 'FAILED', 'TIMED_OUT', 'TERMINATED', 'PAUSED']}
            onChange={(e) => changeLabels(e)}
            selected={labels}
            placeholder="Search by status."
          />
        </Box>
        <Box flexGrow={1}>
          <FormControl>
            <Input
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              placeholder="Search by keyword."
              background="white"
            />
          </FormControl>
        </Box>
        <Button
          className="primary"
          colorScheme="blue"
          onClick={() => {
            changeLabels([]);
            changeQuery('');
          }}
        >
          <i className="fas fa-times" />
        </Button>
      </Grid>
    </>
  );
};

export default ExecutedWorkflowSearchBox;
