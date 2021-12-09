import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite } from '../../components/forms/site-types';

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
};

const SiteDetail: VoidFunctionComponent<Props> = ({ site }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Id" value={site.siteId} />
      <DetailItem label="Management Type" value={site.siteManagementType} />
      <DetailItem label="Site Vpn Flavour" value={site.siteVpnFlavor} />
      <DetailItem label="Site Service QOS Profile" value={site.siteServiceQosProfile} />
      <DetailItem label="Enable BGP PIC fast-reroute" value={site.enableBgpPicFastReroute ? 'yes' : 'no'} />
    </Grid>
  );
};

export default SiteDetail;
