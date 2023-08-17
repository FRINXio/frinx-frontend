import React, { useState, VoidFunctionComponent } from 'react';
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
  Button,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { convertTaskDefinition, ExtendedTask, TaskDefinition } from '@frinx/shared/src';
import { parseDescription, parseLabels } from './left-menu.helpers';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
  taskDefinitions: TaskDefinition[];
  setTaskdefsFilter: React.Dispatch<React.SetStateAction<string>>;
};

const TaskList: VoidFunctionComponent<Props> = ({ onTaskAdd, taskDefinitions, setTaskdefsFilter }) => {
  const [searchInput, setSearchInput] = useState('');

  return (
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FeatherIcon} icon="search" size={20} />
        </InputLeftElement>
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          placeholder="Search tasks"
        />
      </InputGroup>
      <Flex justify="space-between" my={3} gap={2}>
        <Button
          colorScheme="blue"
          color="white"
          onClick={() => {
            setTaskdefsFilter(searchInput);
          }}
        >
          Search
        </Button>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => {
            setTaskdefsFilter('');
            setSearchInput('');
          }}
        >
          Reset
        </Button>
      </Flex>
      {taskDefinitions?.map((tskDefinition) => (
        <Flex
          key={tskDefinition.name}
          alignItems="stretch"
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
              {parseDescription(tskDefinition.description ?? '')}
            </Text>
            <Wrap marginTop={2} spacing={2}>
              {parseLabels(tskDefinition.description ?? '')?.map((label) => (
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
