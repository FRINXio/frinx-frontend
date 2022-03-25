import { Flex, Link } from '@chakra-ui/react';
import React, { FC } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
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
                  to="/uniresource/resourceTypes"
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
              </>
            }
          />
        )}
      </Routes>
    </Flex>
  );
};

export default AppMenu;
