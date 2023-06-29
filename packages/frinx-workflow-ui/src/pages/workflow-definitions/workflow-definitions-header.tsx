import React, { FC } from 'react';
import { Box, Button, Flex, Icon, IconButton, Input, InputGroup, FormLabel } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import WorkflowAutocomplete from '../../components/workflow-autocomplete';

type Props = {
  allLabels: string[];
  keywords: string;
  labels: string[];
  onKeywordsChange: (keywords: string) => void;
  onLabelsChange: (labels: string[]) => void;
  onClearSearch: () => void;
};

function dropNulls<T>(values: (T | null)[]): T[] {
  const result: T[] = [];
  values.forEach((v) => {
    if (v != null) {
      result.push(v);
    }
  });
  return result;
}

const WorkflowDefinitionsHeader: FC<Props> = ({
  allLabels,
  keywords,
  onKeywordsChange,
  labels,
  onLabelsChange,
  onClearSearch,
}) => {
  const searchFavourites = () => {
    const newLabels: (string | null)[] = [...labels];
    const index = newLabels.findIndex((label) => label === 'FAVOURITE');
    newLabels.splice(index, 1, index === -1 ? 'FAVOURITE' : null);
    onLabelsChange(dropNulls(newLabels));
  };

  const starColor = labels.includes('FAVOURITE') ? 'yellow.400' : 'white';

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
      <Flex width="50%" justify="flex-end">
        <IconButton
          aria-label="Favourites"
          colorScheme="blue"
          height={10}
          width={10}
          onClick={searchFavourites}
          title="Favourites"
          icon={<Icon size={24} as={FeatherIcon} fill={starColor} color={starColor} icon="star" />}
        />
      </Flex>
    </Flex>
  );
};

export default WorkflowDefinitionsHeader;
