import { Flex, Text, Grid } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { CustomerLocation } from '../../components/forms/site-types';

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
  location: CustomerLocation;
};

const LocationDetail: VoidFunctionComponent<Props> = ({ location }) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Street" value={location.street} />
      <DetailItem label="Postal Code" value={location.postalCode} />
      <DetailItem label="State" value={location.state} />
      <DetailItem label="City" value={location.city} />
      <DetailItem label="Country Code" value={location.countryCode} />
    </Grid>
  );
};

export default LocationDetail;
