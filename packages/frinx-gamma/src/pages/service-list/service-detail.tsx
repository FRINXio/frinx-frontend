import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { VpnService } from '../../components/forms/service-types';

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
  service: VpnService;
};

const ServiceDetail: VoidFunctionComponent<Props> = ({ service }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Vpn Id" value={service.vpnId} />
      <DetailItem label="Customer Name" value={service.customerName} />
      <DetailItem label="Vpn Service Topology" value={service.vpnServiceTopology} />
      <DetailItem label="Default C Vlan" value={service.defaultCVlan} />
    </Grid>
  );
};

export default ServiceDetail;
