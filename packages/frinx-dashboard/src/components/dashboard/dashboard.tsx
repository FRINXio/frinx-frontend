import React, { FC } from 'react';
import { Box, Container, Heading, HStack } from '@chakra-ui/react';
import Panel from '../panel/panel';
import { ServiceKey } from '../../types';
import UniflowActions from './uniflow-actions';
import UniconfigActions from './uniconfig-actions';
import packageJson from '../../../package.json';

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
        {enabledServices.get('uniconfig_enabled') && (
          <Box>
            <Heading as="h2" size="md" marginBottom={4}>
              UniConfig
            </Heading>
            <UniconfigActions />
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
            {enabledServices.get('uniconfig_enabled') && (
              <Panel
                label="UniConfig"
                description="Manage network device configurations."
                icon="server"
                path="/uniconfig"
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
      </Container>
      <Box bg="gray.200" bottom={0} position="fixed" w="100%" pl={4}>
        v{packageJson.version}
      </Box>
    </>
  );
};

export default Dashboard;
