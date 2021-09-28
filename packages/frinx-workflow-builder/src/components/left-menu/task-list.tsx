import React, { useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Tooltip,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Wrap,
  Badge,
  WrapItem,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import MiniSearch from 'minisearch';
import throttle from 'lodash/throttle';
import { ExtendedTask, TaskDefinition } from '../../helpers/types';
import { convertTaskDefinition } from '../../helpers/task.helpers';
import { getFilteredResults, parseDescription, parseLabels } from './left-menu.helpers';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
  taskDefinitions: TaskDefinition[];
};

const TaskList: VoidFunctionComponent<Props> = ({ onTaskAdd, taskDefinitions }) => {
  const { current: minisearch } = useRef(new MiniSearch({ fields: ['name', 'description'], idField: 'name' }));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    minisearch.addAll(taskDefinitions);
  }, [taskDefinitions, minisearch]);

  const searchFn = throttle(
    () => getFilteredResults(minisearch.search(searchTerm, { prefix: true }), taskDefinitions),
    60,
  );

  const result = searchTerm.length > 2 ? searchFn() : taskDefinitions;

  return (
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search tasks"
        />
      </InputGroup>
      {result?.map((tskDefinition) => (
        <Flex
          key={tskDefinition.name}
          alignItems="stretch"
          // height={16}
          border="1px"
          borderColor="gray.200"
          px={4}
          my={4}
          borderRadius="md"
          userSelect="none"
        >
          <Box py={4} width="85%">
            <Heading as="h4" size="xs" marginBottom={2} isTruncated>
              <Tooltip portalProps={{ appendToParentPortal: true }} label={tskDefinition.name}>
                {tskDefinition.name}
              </Tooltip>
            </Heading>
            <Text fontStyle="italic" color="gray.800">
              {parseDescription(tskDefinition.description)}
            </Text>
            <Wrap marginTop={2} spacing={2}>
              {parseLabels(tskDefinition.description)?.map((label) => (
                <WrapItem key={label}>
                  <Badge>{label}</Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
          <Box marginLeft="auto" alignSelf="center">
            <IconButton
              size="sm"
              aria-label="Add task"
              icon={<AddIcon />}
              onClick={() => {
                onTaskAdd(convertTaskDefinition(tskDefinition));
              }}
            />
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default TaskList;
