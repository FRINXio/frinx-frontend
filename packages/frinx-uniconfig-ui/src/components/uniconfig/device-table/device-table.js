import React, { useState } from 'react';
import ConnectionStatusBadge from '../../common/connection-status-badge';
import {
  Box,
  Flex,
  Text,
  Checkbox,
  IconButton,
  Stack,
  Grid,
  GridItem,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { SettingsIcon, InfoIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';

const DeviceTable = ({ nodes, isChecked, updateNode, onDeviceClick, setIsChecked, onEditClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const checkNode = (node) => {
    let newChecked = [...isChecked];

    if (Array.isArray(node)) {
      newChecked = newChecked.length > 0 ? [] : node;
    } else {
      let index = newChecked.indexOf(node);
      (index === -1 && newChecked.push(node)) || newChecked.splice(index, 1);
    }
    setIsChecked(newChecked);
  };

  return (
    <>
      <Box boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4} marginTop={4}>
        <Grid templateColumns="repeat(16, 1fr)" spacing={4}>
          <GridItem colSpan={1}>
            <Checkbox isChecked={isChecked.length > 0} onChange={() => checkNode(nodes)} size="lg" />
          </GridItem>
          <GridItem colSpan={3}>
            <Flex justify="flex-start">
              <Text as="b">Node ID</Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={3}>
            <Flex justify="flex-start">
              <Text as="b">Host</Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={3}>
            <Flex justify="flex-start">
              <Text as="b">Connection Status</Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={3}>
            <Flex justify="flex-start">
              <Text as="b">Version</Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={3}>
            <Flex justify="flex-end">
              <Text as="b">Actions</Text>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
      {nodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((node, i) => (
        <Box key={`tableRow-${i}`} boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4} marginTop={4}>
          <Grid templateColumns="repeat(16, 1fr)" spacing={4}>
            <GridItem colSpan={1}>
              <Flex h="100%" align="center" justify="flex-start">
                <Checkbox isChecked={isChecked.indexOf(node) !== -1} onChange={() => checkNode(node)} size="lg" />
              </Flex>
            </GridItem>
            <GridItem colSpan={3}>
              <Flex h="100%" align="center" justify="flex-start">
                <Text as="b">{node.nodeId}</Text>
              </Flex>
            </GridItem>
            <GridItem colSpan={3}>
              <Flex h="100%" align="center" justify="flex-start">
                <Text>
                  {node.host || 'resolving...'}
                  <Text as="span" color="gray.500">
                    {node.port ? ':' + node.port : null}
                  </Text>
                </Text>
              </Flex>
            </GridItem>
            <GridItem colSpan={3}>
              <Flex h="100%" align="center" justify="flex-start">
                <ConnectionStatusBadge node={node} checkConnectionStatus={updateNode} />
              </Flex>
            </GridItem>
            <GridItem colSpan={3}>
              <Flex h="100%" align="center" justify="flex-start">
                <Text>{node.osVersion}</Text>
              </Flex>
            </GridItem>
            <GridItem colSpan={3}>
              <Flex h="100%" align="center" justify="flex-end">
                <Stack direction="row" spacing={2}>
                  <IconButton
                    onClick={() => {
                      onDeviceClick(node.nodeId, node.topologyId);
                    }}
                    size="sm"
                    icon={<InfoIcon />}
                  />
                  <IconButton
                    size="sm"
                    onClick={() => {
                      onEditClick(node.nodeId);
                    }}
                    icon={<SettingsIcon />}
                  />
                </Stack>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      ))}
      <Box w="100%" marginTop={4}>
        <Flex justify="space-between" align="center">
          <Text size="md" color="gray.500">
            {nodes.length} nodes total
          </Text>
          <Stack spacing={2} direction="row" justify="flex-end">
            <IconButton
              size="sm"
              icon={<ChevronLeftIcon />}
              style={{ backgroundColor: '#d9e0e6' }}
              disabled={page === 0}
              onClick={() => setPage((prevPage) => prevPage - 1)}
            />
            <Menu placement="top">
              <MenuButton size="sm" as={Button} style={{ backgroundColor: '#d9e0e6' }}>
                {page}
              </MenuButton>
              <MenuList>
                {[...Array(nodes.length % rowsPerPage).keys()].map((page) => (
                  <MenuItem key={`pageOption-${page}`} onClick={() => setPage(page)}>
                    {page}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <IconButton
              size="sm"
              icon={<ChevronRightIcon />}
              style={{ backgroundColor: '#d9e0e6' }}
              disabled={nodes.length % rowsPerPage <= page + 1}
              onClick={() => setPage((prevPage) => prevPage + 1)}
            />
          </Stack>
        </Flex>
      </Box>
    </>
  );
};

export default DeviceTable;
