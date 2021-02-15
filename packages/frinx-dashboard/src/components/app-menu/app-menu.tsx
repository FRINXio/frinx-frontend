import React, { FC } from 'react';
import { Flex, Link } from '@chakra-ui/react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { ServiceKey } from '../../types';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const AppMenu: FC<Props> = ({ enabledServices }) => {
  return (
    <Flex alignItems="stretch" height="100%">
      <Switch>
        {enabledServices.get('uniflow_enabled') && (
          <Route path="/uniflow">
            <Link
              to="/uniflow/definitions"
              as={NavLink}
              exact
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
              exact
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
              exact
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
              exact
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
              exact
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
              exact
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
          </Route>
        )}
          <Route path="/services">
            <Link
              to="/services"
              as={NavLink}
              exact
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
              Jobs
            </Link>
            <Link
              to="/services/scan"
              as={NavLink}
              exact
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
              Scan
            </Link>
          </Route>

      </Switch>
    </Flex>
  );
};

export default AppMenu;
