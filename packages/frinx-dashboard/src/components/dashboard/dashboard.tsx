import React, { FC } from 'react';
import { Box, Button, Container, Flex, Heading, HStack, Image, Text, Wrap } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { faCogs, faLaptopCode } from '@fortawesome/free-solid-svg-icons';
import Panel from '../panel/panel';
import { ServiceKey } from '../../types';
import UniflowActionSvg from './img/uniflow-action.svg';
import UniflowListSvg from './img/uniflow-list.svg';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const Dashboard: FC<Props> = ({ enabledServices }) => {
  return (
    <Container maxWidth={1280}>
      <HStack spacing={4} mb={8}>
        <Box width={80}>
          <Box background="gray.200">
            <Image src={UniflowActionSvg} />
          </Box>
          <Box paddingY={4}>
            <Heading as="h4" size="sm" marginBottom={2}>
              Workflow builder
            </Heading>
            <Text marginBottom={2}>Use our builder to create a new workflow.</Text>
            <Button colorScheme="blue" size="sm" to="/uniflow/builder" as={Link}>
              Create workflow
            </Button>
          </Box>
        </Box>
        <Box width={80}>
          <Box background="gray.200">
            <Image src={UniflowListSvg} />
          </Box>
          <Box paddingY={4}>
            <Heading as="h4" size="sm" marginBottom={2}>
              Available workflows
            </Heading>
            <Text marginBottom={2}>Explore and execute workflows.</Text>
            <Button colorScheme="blue" size="sm" to="/uniflow/builder" as={Link}>
              Explore workflows
            </Button>
          </Box>
        </Box>
      </HStack>
      <Box as="header" mb={4}>
        <Heading as="h2" size="md">
          Frinx services
        </Heading>
      </Box>
      <Wrap spacing={4}>
        {enabledServices.get('uniflow_enabled') && (
          <Panel label="Uniflow" description="Create, organize and execute workflows." icon={faCogs} path="/uniflow" />
        )}
        {enabledServices.get('uniconfig_enabled') && (
          <Panel
            label="Uniconfig"
            description="Manage network device configurations."
            icon={faLaptopCode}
            path="/uniconfig"
          />
        )}
        {enabledServices.get('uniresource_enabled') && (
          <Panel label="Uniresource" description="Manage network devices" icon={faLaptopCode} path="/uniresource" />
        )}
      </Wrap>
    </Container>
  );
};

export default Dashboard;
