import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { TableItem } from './search-helper';

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
  searchItem: TableItem;
};

const SearchDetail: VoidFunctionComponent<Props> = ({ searchItem }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="VPN ID" value={searchItem.vpnId} />
      <DetailItem label="Customer Name" value={searchItem.customerName} />
      <DetailItem label="Site Id" value={searchItem.siteId} />
      <DetailItem label="Device Id" value={searchItem.deviceId} />
      <DetailItem label="Location Id" value={searchItem.locationId} />
      <DetailItem label="Cvlan Id" value={searchItem.cvlanId} />
      <DetailItem label="Customer Address" value={searchItem.customerAddressIpv4} />
      <DetailItem label="Provider Address" value={searchItem.providerAddressIpv4} />
      <DetailItem label="Ne Id" value={searchItem.neId} />
      <DetailItem label="Port Id" value={searchItem.portId} />
      <DetailItem label="Input Bandwidths Id" value={searchItem.inputBandwidth} />
      <DetailItem label="Circuit Reference" value={searchItem.circuitReference} />
      <DetailItem label="Carrier Reference" value={searchItem.carrierReference} />
      <DetailItem label="Bearer Reference" value={searchItem.bearerReference} />
      <DetailItem label="Sp Bearer Reference" value={searchItem.spBearerReference} />
      <DetailItem label="Evc Type" value={searchItem.evcType} />
      <DetailItem label="Admin Status" value={searchItem.adminStatus} />
    </Grid>
  );
};

export default SearchDetail;
