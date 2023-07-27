import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { FC } from 'react';

type Filter = {
  queueName?: string;
  workerId?: string;
  domain?: string;
  beforeDate?: string;
  afterDate?: string;
};

type Props = {
  inputs: Filter;
  setInputs: React.Dispatch<React.SetStateAction<Filter>>;
  filterPollData: () => void;
  resetFilter: () => void;
  onToggle: () => void;
  isOpen: boolean;
};

const PollDataSearchbox: FC<Props> = ({ inputs, setInputs, filterPollData, resetFilter, onToggle, isOpen }) => {
  return (
    <>
      <Flex justify="space-between" mb={8}>
        <Flex>
          <FormControl width={250} ml={2}>
            <FormLabel>Search by queueName</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <Icon size={20} as={FeatherIcon} icon="search" color="grey" />
              </InputLeftElement>
              <Input
                value={inputs.queueName}
                placeholder="Search by name"
                onChange={(e) => setInputs((prev) => ({ ...prev, queueName: e.target.value }))}
                background="white"
              />
            </InputGroup>
          </FormControl>
          <FormControl width={250} ml={2}>
            <FormLabel>Poll time - before</FormLabel>
            <Input
              background="white"
              name="from"
              value={inputs.beforeDate || ''}
              onChange={(e) => setInputs((prev) => ({ ...prev, beforeDate: e.target.value || undefined }))}
              type="datetime-local"
            />
          </FormControl>

          <FormControl ml={2} width={250}>
            <FormLabel>Poll time - after</FormLabel>
            <Input
              background="white"
              name="to"
              value={inputs.afterDate || ''}
              onChange={(e) => setInputs((prev) => ({ ...prev, afterDate: e.target.value || undefined }))}
              type="datetime-local"
            />
          </FormControl>
        </Flex>
        <Flex align="flex-end">
          <Button data-cy="filter-poll-data" onClick={filterPollData} colorScheme="blue">
            Search
          </Button>
          <Button ml={2} data-cy="filter-poll-data" onClick={resetFilter} colorScheme="red" variant="outline">
            Reset
          </Button>
        </Flex>
      </Flex>
      <HStack my={3}>
        <Divider />
        <HStack cursor="pointer" textColor="gray.500" onClick={onToggle}>
          <Text data-cy="device-state-advanced-options" width="max-content">
            Advanced options
          </Text>
          {isOpen ? <FeatherIcon icon="chevron-up" size={20} /> : <FeatherIcon icon="chevron-down" size={20} />}
        </HStack>
        <Divider />
      </HStack>
      {isOpen && (
        <Flex mb={8}>
          <FormControl width={250} ml={2}>
            <FormLabel>Search by domain</FormLabel>

            <Input
              value={inputs.domain}
              placeholder="Search by domain"
              onChange={(e) => setInputs((prev) => ({ ...prev, domain: e.target.value }))}
              background="white"
            />
          </FormControl>
          <FormControl width={250} ml={2}>
            <FormLabel>Last polled by - workerId</FormLabel>

            <Input
              value={inputs.workerId}
              placeholder="Search by workerId"
              onChange={(e) => setInputs((prev) => ({ ...prev, workerId: e.target.value }))}
              background="white"
            />
          </FormControl>
        </Flex>
      )}
    </>
  );
};

export default PollDataSearchbox;
