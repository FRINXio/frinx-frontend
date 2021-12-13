import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite, CustomerLocation, SiteDevice } from '../../components/forms/site-types';

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
  site: VpnSite;
  location: CustomerLocation;
  device: SiteDevice;
};

const DeviceDetail: VoidFunctionComponent<Props> = ({ site, device, location }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Site Id" value={site.siteId} />
      <DetailItem label="Site Management Type" value={site.siteManagementType} />
      <DetailItem label="Site Management Type" value={site.siteManagementType} />
      <DetailItem label="Site Vpn Flavour" value={site.siteVpnFlavor} />
      <DetailItem label="Site Service QOS Profile" value={site.siteServiceQosProfile} />
      <DetailItem label="Enable BGP PIC fast reroute" value={site.enableBgpPicFastReroute ? 'yes' : 'no'} />

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
