import React, { FC } from 'react';
import { Box, Button, Flex, Input, InputGroup, FormLabel } from '@chakra-ui/react';
import WorkflowAutocomplete from '../../components/workflow-autocomplete';

type Props = {
  allLabels: string[];
  keywords: string;
  labels: string[];
  onKeywordsChange: (keywords: string) => void;
  onLabelsChange: (labels: string[]) => void;
  onClearSearch: () => void;
};

const WorkflowDefinitionsHeader: FC<Props> = ({
  allLabels,
  keywords,
  onKeywordsChange,
  labels,
  onLabelsChange,
  onClearSearch,
}) => {
  return (
    <Flex marginBottom={6} alignItems="center">
      <Flex width="50%" align="flex-end">
        <Box flex={1}>
          <FormLabel marginBottom="4">Filter by labels</FormLabel>
          <WorkflowAutocomplete
            options={allLabels}
            onChange={onLabelsChange}
            selected={labels}
            placeholder="Start typing..."
          />
        </Box>
        <Box flex={1}>
          <FormLabel marginLeft="2" htmlFor="workflow-search" marginBottom="4">
            Search workflow by name
          </FormLabel>
          <InputGroup marginBottom={0}>
            <Input
              id="workflow-search"
              marginLeft="2"
              value={keywords}
              onChange={(e) => onKeywordsChange(e.target.value)}
              placeholder="Search workflow"
              background="white"
            />
          </InputGroup>
        </Box>
        <Button marginLeft="2" colorScheme="blue" color="white" onClick={onClearSearch}>
          Reset
        </Button>
      </Flex>
    </Flex>
  );
};

export default WorkflowDefinitionsHeader;
