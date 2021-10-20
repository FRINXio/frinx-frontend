import { Container, Flex, Heading, Box } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import { VpnBearer } from '../../components/forms/bearer-types';
import { apiBearerToClientBearer } from '../../components/forms/converters';

const VpnBearerList: VoidFunctionComponent = () => {
  const [vpnBearers, setVpnBearers] = useState<VpnBearer[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const callbacks = callbackUtils.getCallbacks;
      const response = await callbacks.getVpnBearers();
      const clientVpnBearers = apiBearerToClientBearer(response);
      setVpnBearers(clientVpnBearers);
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth={1200}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="lg">
          Bearers
        </Heading>
      </Flex>
      <Box>{vpnBearers ? <Box>{JSON.stringify(vpnBearers, null, 2)}</Box> : null}</Box>
    </Container>
  );
};

export default VpnBearerList;
