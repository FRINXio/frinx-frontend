// @flow
import React, { useState } from 'react';
import WfAutoComplete from '../../../common/wf-autocomplete';
import _ from 'lodash';
import { Box, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons';

type Workflow = {
  name: string;
  version: number;
  description: string;
  hasSchedule: boolean;
};
type Props = {
  allLabels: string[];
};

const WorkflowDefinitionsHeader = ({ allLabels }: Props) => {
  const [keywords, setKeywords] = useState('');
  const [labels, setLabels] = useState([]);

  const searchFavourites = () => {
    const newLabels = [...labels];
    const index = newLabels.findIndex((label) => label === 'FAVOURITE');
    index > -1 ? newLabels.splice(index, 1) : newLabels.push('FAVOURITE');
    setLabels(newLabels);
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
        <WfAutoComplete options={allLabels} onChange={setLabels} selected={labels} placeholder="Search by label." />
      </Box>
      <Box flex={1}>
        <InputGroup marginBottom={0}>
          <InputLeftElement>
            <Icon as={FontAwesomeIcon} icon={faSearch} color="grey" />
          </InputLeftElement>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Search by keyword."
            background="white"
          />
        </InputGroup>
      </Box>
    </HStack>
  );
};

export default WorkflowDefinitionsHeader;
