import { Flex, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { FC } from 'react';
import { NavLink, Route, Router, Routes } from 'react-router-dom';
import { ServiceKey } from '../../types';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const AppMenu: FC<Props> = ({ enabledServices }) => {
  return (
    <Flex alignItems="stretch" height="100%">
      <Routes>
        {enabledServices.get('isUniflowEnabled') && (
          <Route
            path="/uniflow/*"
            element={
              <>
                <Link
                  to="/uniflow/definitions"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Definitions
                </Link>
                <Link
                  to="/uniflow/executed"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Executed
                </Link>
                <Link
                  to="/uniflow/scheduled"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Scheduled
                </Link>
                <Link
                  to="/uniflow/event-listeners"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Event listeners
                </Link>
                <Link
                  to="/uniflow/tasks"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Tasks
                </Link>
                <Link
                  to="/uniflow/poll-data"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Poll data
                </Link>
              </>
            }
          />
        )}
        {enabledServices.get('isUniresourceEnabled') && (
          <Route
            path="/uniresource/*"
            element={
              <>
                <Menu>
                  <MenuButton
                    as={Link}
                    color="brand.50"
                    display="flex"
                    alignItems="center"
                    paddingX={4}
                    borderBottomWidth={4}
                    borderColor="transparent"
                    borderStyle="solid"
                    _hover={{
                      borderColor: 'brand.50',
                    }}
                    _active={{
                      background: 'brand.800',
                    }}
                  >
                    IPAM
                  </MenuButton>
                  <MenuList>
                    <MenuItem to="/uniresource/ipam" as={NavLink}>
                      IPAM
                    </MenuItem>
                    <MenuItem as={NavLink} to="/uniresource/ipam/aggregates">
                      Aggregates
                    </MenuItem>
                    <MenuItem as={NavLink} to="/uniresource/ipam/ip-ranges">
                      IP Ranges
                    </MenuItem>
                    {/* <MenuItem>Prefixes</MenuItem> */}
                  </MenuList>
                </Menu>

                <Link
                  to="/uniresource/pools"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Pools
                </Link>
                <Link
                  to="/uniresource/strategies"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Strategies
                </Link>
                <Link
                  to="/uniresource/resource_types"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Resource Types
                </Link>
              </>
            }
          />
        )}
        {enabledServices.get('isInventoryEnabled') && (
          <Route
            path="/inventory/*"
            element={
              <>
                <Link
                  to="/inventory/devices"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Devices
                </Link>
                <Link
                  to="/inventory/blueprints"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Blueprints
                </Link>
                <Link
                  to="/inventory/transactions"
                  as={NavLink}
                  color="brand.50"
                  display="flex"
                  alignItems="center"
                  paddingX={4}
                  borderBottomWidth={4}
                  borderColor="transparent"
                  borderStyle="solid"
                  _hover={{
                    borderColor: 'brand.50',
                  }}
                  _active={{
                    background: 'brand.800',
                  }}
                >
                  Transactions
                </Link>
              </>
            }
          />
        )}
      </Routes>
    </Flex>
  );
};

export default AppMenu;
