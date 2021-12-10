import { Flex, Grid, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { SiteNetworkAccess } from '../../components/forms/site-types';

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
  networkAccess: SiteNetworkAccess;
};

const SiteNetworkAccessDetail: VoidFunctionComponent<Props> = ({ networkAccess }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Site Network Access Id" value={networkAccess.siteNetworkAccessId} />
      <DetailItem label="Location Id" value={networkAccess.locationReference} />
      <DetailItem label="Device Id" value={networkAccess.deviceReference} />
      <DetailItem label="Clan Id" value={networkAccess.bearer.requestedCLan} />
      <DetailItem label="Bearer Reference" value={networkAccess.bearer.bearerReference} />
      <DetailItem label="Provider Address" value={networkAccess.ipConnection?.ipv4?.addresses?.providerAddress} />
      <DetailItem label="Customer Address" value={networkAccess.ipConnection?.ipv4?.addresses?.customerAddress} />
      <DetailItem label="Prefix Length" value={networkAccess.ipConnection?.ipv4?.addresses?.prefixLength} />
      <DetailItem label="Bfd Profile" value={networkAccess.ipConnection?.oam?.bfd?.profileName} />
      <DetailItem label="Svc Input Bandwidth" value={networkAccess.service.svcInputBandwidth} />
      <DetailItem label="Qos Profile" value={networkAccess.service.qosProfiles[0]} />
      <DetailItem label="Maximum Routes" value={networkAccess.maximumRoutes} />
      <DetailItem label="Access Priority" value={networkAccess.accessPriority} />
      <DetailItem label="Site Role" value={networkAccess.siteRole} />
    </Grid>
  );
};

export default SiteNetworkAccessDetail;
