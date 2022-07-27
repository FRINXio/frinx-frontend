import React, { FC, useCallback, useEffect } from 'react';
import { ButtonGroup, Button, Box, Flex, FormControl, Grid, Input, Text, IconButton, Icon } from '@chakra-ui/react';
import WfAutoComplete from '../../../../common/wf-autocomplete';
import FeatherIcon from 'feather-icons-react';
import { debounce } from 'lodash';

type Props = {
  showFlat: boolean;
  labels: string[];
  changeLabels: (e: string[]) => void;
  changeView: () => void;
  changeQuery: (e: string) => void;
  keywords: string;
  onKeywordsChange: (keywords: string) => void;
};

const ExecutedWorkflowSearchBox: FC<Props> = ({
  changeLabels,
  changeQuery,
  changeView,
  showFlat,
  labels,
  keywords,
  onKeywordsChange,
}) => {
  const debouncedSearch = useCallback(
    debounce((query) => {
      changeQuery(query);
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(keywords);
  }, [keywords]);

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
              value={keywords}
              onChange={(e) => onKeywordsChange(e.target.value)}
              placeholder="Search by keyword. (case sensitive)"
              background="white"
            />
          </FormControl>
        </Box>
        <IconButton
          aria-label="Clear"
          colorScheme="blue"
          onClick={() => {
            changeLabels([]);
            changeQuery('');
          }}
          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
        />
      </Grid>
    </>
  );
};

export default ExecutedWorkflowSearchBox;
