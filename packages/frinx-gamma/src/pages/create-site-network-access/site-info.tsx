import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { VpnSite } from '../../components/forms/site-types';

type Props = {
  site: VpnSite;
};

const SiteInfo: FC<Props> = ({ site }: Props) => {
  return (
    <Box>
      <Text>Site Management Type: {site.siteManagementType}</Text>
      <Text>Site VPN Flavor: {site.siteVpnFlavor}</Text>
      <Text>Site Service QOS Profile: {site.siteServiceQosProfile}</Text>
      <Text>Site BGP PIC fast reroute: {site.enableBgpPicFastReroute ? 'enabled' : 'disabled'}</Text>
    </Box>
  );
};

export default SiteInfo;
