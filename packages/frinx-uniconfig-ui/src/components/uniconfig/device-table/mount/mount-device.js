import React, { useEffect, useState } from 'react';
import { Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import _ from 'lodash';
import CliTab from './cli-tab';
import NetconfTab from './netconf-tab';
import callbackUtils from '../../../../utils/callback.utils';

const MountDevice = ({ templateNode }) => {
  const [supportedDevices, setSupportedDevices] = useState([]);

  useEffect(() => {
    getSupportedDevices();
  }, [templateNode]);

  const getSupportedDevices = () => {
    const getCliDeviceTranslations = callbackUtils.getCliDeviceTranslationsCallback();

    getCliDeviceTranslations().then((res) => {
      try {
        const supportedDevices = res['available-cli-device-translations']['available-cli-device-translation'];
        const grouped = _.groupBy(supportedDevices, (device) => device['device-type']);
        setSupportedDevices(grouped);
      } catch (e) {
        console.log(e);
      }
    });
  };

  return (
    <Container maxWidth={1280}>
      <Heading as="h2" size="3xl" marginBottom={6}>
        Mount Device
      </Heading>
      <Box boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4} marginTop={4}>
        <Tabs defaultIndex={templateNode?.topologyId === 'topology-netconf' ? 1 : 0} isFitted>
          <TabList>
            <Tab>CLI</Tab>
            <Tab>Netconf</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CliTab supportedDevices={supportedDevices} templateNode={templateNode} />
            </TabPanel>
            <TabPanel>
              <NetconfTab templateNode={templateNode} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default MountDevice;
