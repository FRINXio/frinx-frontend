import React, { VoidFunctionComponent } from 'react';
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
  Icon,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { ExtendedTask, TaskDefinition } from '../../helpers/types';
import { convertTaskDefinition } from '../../helpers/task.helpers';
import { parseDescription, parseLabels } from './left-menu.helpers';
import { useMinisearch } from '@frinx/shared/src';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
  taskDefinitions: TaskDefinition[];
};

const TaskList: VoidFunctionComponent<Props> = ({ onTaskAdd, taskDefinitions }) => {
  const { results, searchText, setSearchText } = useMinisearch({
    items: taskDefinitions.map((td) => ({ ...td, Name: td.name })),
    searchFields: ['name', 'description'],
  });

  return (
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FeatherIcon} icon="search" size={20} />
        </InputLeftElement>
        <Input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="Search tasks"
        />
      </InputGroup>
      {results?.map((tskDefinition) => (
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
              icon={<Icon as={FeatherIcon} icon="plus" size={20} />}
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
