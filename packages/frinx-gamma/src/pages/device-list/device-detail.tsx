import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { CustomerLocation, SiteDevice } from '../../components/forms/site-types';

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
  device: SiteDevice;
  location: CustomerLocation;
};

const DeviceDetail: VoidFunctionComponent<Props> = ({ device, location }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Location Id" value={location.locationId} />
      <DetailItem label="Street" value={location.street} />
      <DetailItem label="Postal Code" value={location.postalCode} />
      <DetailItem label="State" value={location.state} />
      <DetailItem label="City" value={location.city} />
      <DetailItem label="Country Code" value={location.countryCode} />

      <DetailItem label="Device Id" value={device.deviceId} />
      <DetailItem label="Management" value={device.managementIP} />
    </Grid>
  );
};

export default DeviceDetail;
