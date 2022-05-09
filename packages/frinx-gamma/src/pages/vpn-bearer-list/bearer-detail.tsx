import { Flex, Grid, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { VpnBearer } from '../../components/forms/bearer-types';

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
  bearer: VpnBearer;
};

const BearerDetail: VoidFunctionComponent<Props> = ({ bearer }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Id" value={bearer.spBearerReference} />
      <DetailItem label="Description" value={bearer.description} />
      <DetailItem label="Ne Id" value={bearer.neId} />
      <DetailItem label="Port Id" value={bearer.portId} />
      <DetailItem label="Carrier Name" value={bearer.carrier?.carrierName} />
      <DetailItem label="Service Type" value={bearer.carrier?.serviceType} />
      <DetailItem label="Service Status" value={bearer.carrier?.serviceStatus} />
      <DetailItem label="Encapsulation Type" value={bearer.connection?.encapsulationType} />
      <DetailItem label="Svlan Assignment Type" value={bearer.connection?.svlanAssignmentType} />
      <DetailItem label="Tpid" value={bearer.connection?.tpId} />
      <DetailItem label="Mtu" value={bearer.connection?.mtu} />
      <DetailItem label="Admin Status" value={bearer.status?.adminStatus?.status} />
      <DetailItem label="Oper Status" value={bearer.status?.operStatus?.status} />
    </Grid>
  );
};

export default BearerDetail;
