import { Box, Container, Heading } from '@chakra-ui/react';
import React, { useEffect, VoidFunctionComponent } from 'react';
import callbackUtils from '../../callback-utils';
import { VpnBearer } from '../../components/forms/bearer-types';
import VpnBearerForm from '../../components/forms/vpn-bearer-form';
import { generateBearerId } from '../../helpers/id-helpers';

const defaultVpnBearer: VpnBearer = {
  neId: '',
  portId: '',
  spBearerReference: '',
  carrier: null,
  defaultUpstreamBearer: null,
  connection: null,
  description: null,
  evcAttachments: [],
  status: null,
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateBearerPage: VoidFunctionComponent<Props> = ({ onSuccess, onCancel }) => {
  useEffect(() => {
    const fetchData = async () => {
      // TODO; possible fetches goes here
    };

    fetchData();
  }, []);

  const handleSubmit = async (bearer: VpnBearer) => {
    // eslint-disable-next-line no-console
    console.log('submit clicked', bearer);
    // eslint-disable-next-line no-param-reassign
    const newBearer: VpnBearer = {
      ...bearer,
      spBearerReference: generateBearerId(),
    };
    const callbacks = callbackUtils.getCallbacks;
    await callbacks.createVpnBearer(newBearer);
    // eslint-disable-next-line no-console
    console.log('bearer created');
    onSuccess();
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log('cancel clicked');
    onCancel();
  };

  return (
    <Container>
      <Box padding={6} margin={6} background="white">
        <Heading size="md">Create VPN Bearer</Heading>
        <VpnBearerForm mode="add" bearer={defaultVpnBearer} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Box>
    </Container>
  );
};

export default CreateBearerPage;
