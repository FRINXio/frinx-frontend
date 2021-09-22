import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
  HStack,
  Tag,
  Box,
  Divider,
  Button,
  Stack,
  FormControl,
  FormLabel,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { v4 as uuid4 } from 'uuid';
import { CustomerLocation, VpnSite } from './site-types';
import CustomerLocationForm from './customer-location-form';
import unwrap from '../../helpers/unwrap';

type Props = {
  mode: 'add' | 'edit';
  sites: VpnSite[];
  site: VpnSite;
  onSubmit: (s: VpnSite) => void;
  onCancel: () => void;
  onSiteChange?: (s: VpnSite) => void;
};

const getDefaultCustomerLocation = (): CustomerLocation => ({
  city: '',
  street: '',
  postalCode: '',
  state: '',
  countryCode: 'UK',
});

const VpnSiteForm: FC<Props> = ({ site, onSubmit, onCancel }) => {
  const [siteState, setSiteState] = useState(site);
  const [customerLocationsForm, setCustomerLocationsForm] = useState<CustomerLocation | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    setSiteState({
      ...site,
    });
  }, [site]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(siteState);
  };

  const handleCustomerLocationAdd = (location: CustomerLocation) => {
    const locationWithRandomId = {
      ...location,
      locationId: uuid4(),
    };
    const newCustomerLocations = [...siteState.customerLocations, locationWithRandomId];
    setSiteState({
      ...siteState,
      customerLocations: newCustomerLocations,
    });
    setCustomerLocationsForm(null);
  };

  const handleCustomerLocationRemove = (locationId: string) => {
    const newCustomerLocations = siteState.customerLocations.filter((cl) => cl.locationId !== locationId);
    setSiteState({
      ...siteState,
      customerLocations: newCustomerLocations,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="customer-locations" my={6}>
        <FormLabel>Cutomer Locations</FormLabel>
        <Box
          alignItems="stretch"
          border="1px"
          borderColor="gray.200"
          px={4}
          my={4}
          borderRadius="md"
          userSelect="none"
          flexDirection="column"
        >
          <CustomerLocationForm
            location={getDefaultCustomerLocation()}
            buttonText="Add"
            onChange={handleCustomerLocationAdd}
          />
          {siteState.customerLocations.length > 0 && (
            <Box>
              <HStack>
                {siteState.customerLocations.map((cl) => {
                  return (
                    <Box key={`customer-location-${cl.locationId}`} my={4}>
                      <Tag key={`customer-location-${cl.locationId}`} size="lg">
                        <TagLabel>{`${cl.street},${cl.city}`}</TagLabel>
                        <TagCloseButton onClick={() => handleCustomerLocationRemove(unwrap(cl.locationId))} />
                      </Tag>
                    </Box>
                  );
                })}
              </HStack>
            </Box>
          )}
        </Box>
      </FormControl>

      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue">
          Save changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default VpnSiteForm;
