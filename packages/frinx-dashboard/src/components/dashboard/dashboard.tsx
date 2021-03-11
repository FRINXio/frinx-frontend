import React, { FC } from 'react';
import { Box, Container, Heading, HStack } from '@chakra-ui/react';
import Panel from '../panel/panel';
import { ServiceKey } from '../../types';
import UniflowActions from './uniflow-actions';
import UniconfigActions from './uniconfig-actions';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const Dashboard: FC<Props> = ({ enabledServices }) => {
  return (
    <Container maxWidth={1280}>
      {enabledServices.get('uniflow_enabled') && (
        <Box marginBottom={12}>
          <Heading as="h2" size="md" marginBottom={4}>
            Uniflow
          </Heading>
          <UniflowActions />
        </Box>
      )}
      {enabledServices.get('uniconfig_enabled') && (
        <Box marginBottom={12}>
          <Heading as="h2" size="md" marginBottom={4}>
            Uniconfig
          </Heading>
          <UniconfigActions />
        </Box>
      )}
      <Box as="header" mb={4}>
        <Heading as="h2" size="md">
          Frinx services
        </Heading>
      </Box>
      <HStack spacing={4}>
        {enabledServices.get('uniflow_enabled') && (
          <Panel label="Uniflow" description="Create, organize and execute workflows." icon="layers" path="/uniflow" />
        )}
        {enabledServices.get('uniconfig_enabled') && (
          <Panel
            label="Uniconfig"
            description="Manage network device configurations."
            icon="server"
            path="/uniconfig"
          />
        )}
        {enabledServices.get('uniresource_enabled') && (
          <Panel label="Uniresource" description="Manage network devices." icon="hard-drive" path="/uniresource" />
        )}
      </HStack>
    </Container>
  );
};

export default Dashboard;
