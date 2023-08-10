import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ClientWorkflow, createSubWorkflowTask, ExtendedTask } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
// import throttle from 'lodash/throttle';
// import MiniSearch from 'minisearch';
import React, { useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import { getFilteredResults, parseDescription, parseLabels } from './left-menu.helpers';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
  workflows: ClientWorkflow[];
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
};

const WorkflowList: VoidFunctionComponent<Props> = ({ onTaskAdd, setFilter, filter, workflows }) => {

  return (
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FeatherIcon} icon="search" size={20} />
        </InputLeftElement>
        <Input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          placeholder="Search workflows"
        />
      </InputGroup>
      {workflows?.map((wf) => (
        <Flex
          key={wf.id}
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
              <Tooltip portalProps={{ appendToParentPortal: true }} label={wf.name}>
                {wf.name}
              </Tooltip>
            </Heading>
            <Text fontStyle="italic" color="gray.800">
              {parseDescription(wf.description ?? '')}
            </Text>
            <Wrap marginTop={2} spacing={2}>
              {parseLabels(wf.description ?? '')?.map((label) => (
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
                onTaskAdd(createSubWorkflowTask(wf.name, (wf.version ?? 1).toString(), wf.inputParameters ?? []));
              }}
            />
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default WorkflowList;
