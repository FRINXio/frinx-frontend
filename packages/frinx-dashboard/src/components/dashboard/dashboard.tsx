import { Box, Code, Container, Heading, HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ServiceKey } from '../../types';
import Panel from '../panel/panel';
import InventoryActions from './inventory-actions';
import UniflowActions from './uniflow-actions';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const Dashboard: FC<Props> = ({ enabledServices }) => {
  return (
    <>
      <Container maxWidth={1280}>
        {enabledServices.get('isUniflowEnabled') && (
          <Box marginBottom={12}>
            <Heading as="h2" size="md" marginBottom={4}>
              UniFlow
            </Heading>
            <UniflowActions />
          </Box>
        )}
        {enabledServices.get('isInventoryEnabled') && (
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
            {enabledServices.get('isUniflowEnabled') && (
              <Panel
                label="UniFlow"
                description="Create, organize and execute workflows."
                icon="layers"
                path="/uniflow"
              />
            )}
            {enabledServices.get('isInventoryEnabled') && (
              <Panel
                label="Device Inventory"
                description="Manage network device configurations."
                icon="server"
                path="/inventory"
              />
            )}
            {enabledServices.get('isUniresourceEnabled') && (
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
              Documentation
            </Heading>
          </Box>
          <HStack spacing={4}>
            <Panel
              label="UniConfig"
              description="Learn more about UniConfig API using Swagger."
              icon="book"
              path={window.__CONFIG__.uniconfigApiDocsURL}
              isLinkExternal
            />
            <Panel
              label="UniFlow"
              description="Learn more about UniFlow API using Swagger."
              icon="book"
              path={window.__CONFIG__.uniflowApiDocsURL}
              isLinkExternal
            />
            {window.__CONFIG__.isAuthEnabled ? null : (
              <Panel
                label="Device Inventory"
                description="Execute and inspect queries with GraphQL Playground."
                icon="book"
                path={window.__CONFIG__.inventoryApiURL}
                isLinkExternal
              />
            )}
          </HStack>
        </Box>
      </Container>
      <Box bg="gray.200" bottom={0} position="fixed" paddingX={4} fontSize="sm">
        <Code>{window.__CONFIG__.commitHash}</Code>
      </Box>
    </>
  );
};

export default Dashboard;
