import { Box, Container, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useConfig } from '../../config.provider';
import { GlobalConfig } from '../../types';
import Panel from '../panel/panel';
import ElisaLogo from './img/elisa-logo.png';
import InventoryActions from './inventory-actions';
import UniflowActions from './uniflow-actions';

const isDocumentationVisible = (config: GlobalConfig): boolean => {
  const {
    uniconfigApiDocsURL,
    uniflowApiDocsURL,
    resourceManagerApiDocsURL,
    topologyDiscoveryApiDocsURL,
    performanceMonitorApiDocsURL,
    inventoryApiURL,
    isAuthEnabled,
  } = config;
  if (
    !uniflowApiDocsURL &&
    !uniconfigApiDocsURL &&
    !resourceManagerApiDocsURL &&
    !performanceMonitorApiDocsURL &&
    !topologyDiscoveryApiDocsURL &&
    (isAuthEnabled || (!isAuthEnabled && !inventoryApiURL))
  ) {
    return false;
  }
  return true;
};

const Dashboard: VoidFunctionComponent = () => {
  const config = useConfig();
  const {
    uniflowApiDocsURL,
    inventoryApiURL,
    isAuthEnabled,
    uniconfigApiDocsURL,
    resourceManagerApiDocsURL,
    performanceMonitorApiDocsURL,
    topologyDiscoveryApiDocsURL,
    schellarApiDocsURL,
    commitHash,
  } = config;
  return (
    <Flex flexDirection="column" minHeight="calc(100vh - 10px - 64px - 32px)">
      <Container maxWidth={1280} marginBottom={8}>
        <Box marginBottom={12}>
          <Heading as="h2" size="lg" marginBottom={6}>
            Workflow manager
          </Heading>
          <UniflowActions />
        </Box>

        <Box>
          <Heading as="h2" size="lg" marginBottom={6}>
            Device Inventory
          </Heading>
          <InventoryActions />
        </Box>
        <Box marginTop={20}>
          <Box as="header" marginBottom={6}>
            <Heading as="h2" size="lg">
              FRINX services
            </Heading>
          </Box>
          <Grid templateColumns="repeat(3, 1fr)" gap={1.5}>
            <Panel
              label="Workflow manager"
              description="Create, organize and execute workflows."
              icon="layers"
              path="/workflow-manager"
            />
            <Panel
              label="Device Inventory"
              description="Manage network device configurations."
              icon="server"
              path="/inventory"
            />

            <Panel
              label="Resource manager"
              description="Manage logical resources."
              icon="hard-drive"
              path="/resource-manager"
            />
          </Grid>
        </Box>
        {isDocumentationVisible(config) && (
          <Box marginTop={20}>
            <Box as="header" marginBottom={4}>
              <Heading as="h2" size="md">
                Documentation
              </Heading>
            </Box>
            <Grid templateColumns="repeat(3, 1fr)" gap={1.5}>
              {uniconfigApiDocsURL && (
                <Panel
                  label="UniConfig"
                  description="Learn more about UniConfig API using Swagger."
                  icon="book"
                  path={uniconfigApiDocsURL}
                  isLinkExternal
                />
              )}
              {uniflowApiDocsURL && (
                <Panel
                  label="Workflow manager"
                  description="Learn more about Workflow manager API using Swagger."
                  icon="book"
                  path={uniflowApiDocsURL}
                  isLinkExternal
                />
              )}
              {isAuthEnabled ? null : (
                <Panel
                  label="Device Inventory"
                  description="Execute and inspect queries with GraphQL Playground."
                  icon="book"
                  path={inventoryApiURL}
                  isLinkExternal
                />
              )}
              {resourceManagerApiDocsURL && (
                <Panel
                  label="Resource Manager"
                  description="Execute and inspect queries with GraphQL Playground."
                  icon="book"
                  path={resourceManagerApiDocsURL}
                  isLinkExternal
                />
              )}
              {performanceMonitorApiDocsURL && (
                <Panel
                  label="Performance Monitor"
                  description="Execute and inspect queries with GraphQL Playground."
                  icon="book"
                  path={performanceMonitorApiDocsURL}
                  isLinkExternal
                />
              )}
              {topologyDiscoveryApiDocsURL && (
                <Panel
                  label="Topology Discovery"
                  description="Execute and inspect queries with GraphQL Playground."
                  icon="book"
                  path={topologyDiscoveryApiDocsURL}
                  isLinkExternal
                />
              )}
              {schellarApiDocsURL && (
                <Panel
                  label="Schellar"
                  description="Execute and inspect queries with GraphQL Playground."
                  icon="book"
                  path={schellarApiDocsURL}
                  isLinkExternal
                />
              )}
            </Grid>
          </Box>
        )}
      </Container>
      <Box
        as="footer"
        bg="white"
        color="blackAlpha.800"
        fontSize="xs"
        marginTop="auto"
        paddingX={8}
        paddingY={8}
        boxShadow="inner"
        borderTopColor="gray.100"
        borderStyle="solid"
        borderWidth={1}
      >
        <Container maxWidth={1280}>
          <Flex alignItems="center">
            <Text>
              Version:{' '}
              <Text as="span" fontFamily="monospace">
                {commitHash}
              </Text>
            </Text>
            <Box marginLeft="auto">
              <Image src={ElisaLogo} alt="Elisa" width={20} />
            </Box>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
};

export default Dashboard;
