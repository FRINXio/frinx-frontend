import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { EvcAttachment } from '../../components/forms/bearer-types';

type ItemProps = {
  label: string;
  value?: string | number | null;
};

const DetailItem: VoidFunctionComponent<ItemProps> = ({ label, value }) => {
  return (
    <Flex>
      <Text mr={4} fontWeight="bold">
        {label}:
      </Text>
      <Text>{value}</Text>
    </Flex>
  );
};

type Props = {
  evc: EvcAttachment;
};

const EvcDetail: VoidFunctionComponent<Props> = ({ evc }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Evc Type" value={evc.evcType} />
      <DetailItem label="Circuit Reference" value={evc.circuitReference} />
      <DetailItem label="Carrier Reference" value={evc.carrierReference} />
      <DetailItem label="Svlan Id" value={evc.svlanId} />
      <DetailItem label="Input Bandwidth" value={evc.inputBandwidth} />
      <DetailItem label="Qos Input Profile" value={evc.qosInputProfile} />
      <DetailItem label="Customer Name" value={evc.customerName} />
      <DetailItem label="Admin Status" value={evc.status?.adminStatus?.status} />
      <DetailItem label="Oper Status" value={evc.status?.operStatus?.status} />
    </Grid>
  );
};

export default EvcDetail;
