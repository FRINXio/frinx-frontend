import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import CliTab from './CliTab';
import NetconfTab from './NetconfTab';
import callbackUtils from '../../../../utils/callbackUtils';

import { Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';

const MountDevice = ({ templateNode }) => {
  const [tab, setTab] = useState(0);
  const [supportedDevices, setSupportedDevices] = useState([]);

  useEffect(() => {
    // if node was selected as template
    setTab(templateNode?.topologyId === 'topology-netconf' ? 1 : 0);
    getSupportedDevices();
  }, [templateNode]);

  const getSupportedDevices = () => {
    const getCliDeviceTranslations = callbackUtils.getCliDeviceTranslationsCallback();

    getCliDeviceTranslations().then((res) => {
      try {
        const supportedDevices = res['available-cli-device-translations']['available-cli-device-translation'];
        const grouped = _.groupBy(supportedDevices, function (device) {
          return device['device-type'];
        });
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
        <Tabs index={tab} onChange={(index) => setTab(index)} isFitted>
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
