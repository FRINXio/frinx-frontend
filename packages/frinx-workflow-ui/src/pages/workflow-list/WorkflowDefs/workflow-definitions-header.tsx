// @flow
import React, { FC } from 'react';
import { Box, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons';
import WfAutoComplete from '../../../common/wf-autocomplete';

type Props = {
  allLabels: string[];
  keywords: string[];
  onKeywordsChange: (keywords: string) => void;
  labels: string[];
  onLabelsChange: (labels: string[]) => void;
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

const WorkflowDefinitionsHeader: FC<Props> = ({ allLabels, keywords, onKeywordsChange, labels, onLabelsChange }) => {
  const searchFavourites = () => {
    const newLabels: (string | null)[] = [...labels];
    const index = newLabels.findIndex((label) => label === 'FAVOURITE');
    newLabels.splice(index, 1, index === -1 ? 'FAVOURITE' : null);
    onLabelsChange(dropNulls(newLabels));
  };

  return (
    <HStack spacing={4} marginBottom={8} alignItems="center">
      <Box width={10}>
        <IconButton
          aria-label="Favourites"
          colorScheme="blue"
          height={9}
          width={9}
          onClick={searchFavourites}
          title="Favourites"
          icon={<Icon as={FontAwesomeIcon} icon={labels.includes('FAVOURITE') ? faStar : faStarOutlined} />}
        />
      </Box>
      <Box flex={1}>
        <WfAutoComplete
          options={allLabels}
          onChange={onLabelsChange}
          selected={labels}
          placeholder="Search by label."
        />
      </Box>
      <Box flex={1}>
        <InputGroup marginBottom={0}>
          <InputLeftElement>
            <Icon as={FontAwesomeIcon} icon={faSearch} color="grey" />
          </InputLeftElement>
          <Input
            value={keywords}
            onChange={(e) => onKeywordsChange(e.target.value)}
            placeholder="Search by keyword."
            background="white"
          />
        </InputGroup>
      </Box>
    </HStack>
  );
};

export default WorkflowDefinitionsHeader;
