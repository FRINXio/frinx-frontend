import React, { FC } from 'react';
import { Box, Code, Container, Heading, HStack, List, ListItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Panel from '../panel/panel';
import { ServiceKey } from '../../types';
import UniflowActions from './uniflow-actions';
import InventoryActions from './inventory-actions';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const Dashboard: FC<Props> = ({ enabledServices }) => {
  return (
    <>
      <Container maxWidth={1280}>
        {enabledServices.get('uniflow_enabled') && (
          <Box marginBottom={12}>
            <Heading as="h2" size="md" marginBottom={4}>
              UniFlow
            </Heading>
            <UniflowActions />
          </Box>
        )}
        {enabledServices.get('inventory_enabled') && (
          <Box>
            <Heading as="h2" size="md" marginBottom={4}>
              Device Inventory
            </Heading>
            <InventoryActions />
          </Box>
        )}
        <Box marginTop={20}>
          <Box as="header" marginBottom={4}>
            <Heading as="h2" size="md">
              FRINX services
            </Heading>
          </Box>
          <HStack spacing={4}>
            {enabledServices.get('uniflow_enabled') && (
              <Panel
                label="UniFlow"
                description="Create, organize and execute workflows."
                icon="layers"
                path="/uniflow"
              />
            )}
            {enabledServices.get('inventory_enabled') && (
              <Panel
                label="Device Inventory"
                description="Manage network device configurations."
                icon="server"
                path="/inventory"
              />
            )}
            {enabledServices.get('uniresource_enabled') && (
              <Panel
                label="UniResource"
                description="Manage logical resources."
                icon="hard-drive"
                path="/uniresource"
              />
            )}
          </HStack>
        </Box>
        <Box marginTop={20}>
          <Box as="header" marginBottom={4}>
            <Heading as="h2" size="md">
              Docs
            </Heading>
          </Box>
          <List mb={10}>
            {/* <ListItem>
              <p>
                <Link to="/api/uniconfig">UniConfig</Link>
              </p>
            </ListItem> */}
            <ListItem>
              <p>
                <Link to="/api/inventory">Device inventory</Link>
              </p>
            </ListItem>
          </List>
        </Box>
      </Container>
      <Box bg="gray.200" bottom={0} position="fixed" paddingX={4} fontSize="sm">
        <Code>{COMMIT_HASH}</Code>
      </Box>
    </>
  );
};

export default Dashboard;
