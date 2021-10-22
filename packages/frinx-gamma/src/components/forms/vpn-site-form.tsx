import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
  HStack,
  Tag,
  Box,
  Divider,
  Button,
  Select,
  Stack,
  FormControl,
  FormLabel,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
// import { v4 as uuid4 } from 'uuid';
import { CustomerLocation, SiteDevice, SiteManagementType, VpnSite, MaximumRoutes } from './site-types';
// import CustomerLocationForm from './customer-location-form';
import SiteDeviceForm from './site-device-form';
import Autocomplete from '../autocomplete/autocomplete';
import unwrap from '../../helpers/unwrap';

type Props = {
  mode: 'add' | 'edit';
  sites: VpnSite[];
  site: VpnSite;
  qosProfiles: string[];
  onSubmit: (s: VpnSite) => void;
  onCancel: () => void;
  onSiteChange?: (s: VpnSite) => void;
};

// const getDefaultCustomerLocation = (): CustomerLocation => ({
//   city: '',
//   street: '',
//   postalCode: '',
//   state: '',
//   countryCode: 'UK',
// });

const getDefaultSiteDevice = (): SiteDevice => ({
  deviceId: '',
  locationId: '',
  managementIP: '',
});

const VpnSiteForm: FC<Props> = ({ site, qosProfiles, onSubmit, onCancel }) => {
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

  // const handleCustomerLocationAdd = (location: CustomerLocation) => {
  //   const locationWithRandomId = {
  //     ...location,
  //     locationId: uuid4(),
  //   };
  //   const newCustomerLocations = [...siteState.customerLocations, locationWithRandomId];
  //   setSiteState({
  //     ...siteState,
  //     customerLocations: newCustomerLocations,
  //   });
  //   setCustomerLocationsForm(null);
  // };

  // const handleCustomerLocationRemove = (locationId: string) => {
  //   const newCustomerLocations = siteState.customerLocations.filter((cl) => cl.locationId !== locationId);
  //   setSiteState({
  //     ...siteState,
  //     customerLocations: newCustomerLocations,
  //   });
  // };

  const handleSiteDeviceAdd = (device: SiteDevice) => {
    if (!device.deviceId) {
      return;
    }

    // if device id is already in form do nothing
    if (siteState.siteDevices.filter((d) => d.deviceId === device.deviceId).length) {
      return;
    }

    const newSiteDevices = [...siteState.siteDevices, device];
    setSiteState({
      ...siteState,
      siteDevices: newSiteDevices,
    });
  };

  const handleSiteDeviceRemove = (deviceId: string) => {
    const newSiteDevices = siteState.siteDevices.filter((sd) => sd.deviceId !== deviceId);
    setSiteState({
      ...siteState,
      siteDevices: newSiteDevices,
    });
  };

  const handleProfileNameChange = (profileName: string) => {
    setSiteState({
      ...siteState,
      siteServiceQosProfile: profileName,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <FormControl id="customer-locations" my={6}>
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
      </FormControl> */}

      <FormControl id="site-devices" my={6}>
        <FormLabel>Site Devices</FormLabel>
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
          <SiteDeviceForm device={getDefaultSiteDevice()} buttonText="Add" onChange={handleSiteDeviceAdd} />
          {siteState.siteDevices.length > 0 && (
            <Box>
              <HStack>
                {siteState.siteDevices.map((sd) => {
                  return (
                    <Box key={`customer-location-${sd.deviceId}`} my={4}>
                      <Tag key={`customer-location-${sd.deviceId}`} size="lg">
                        <TagLabel>{sd.deviceId}</TagLabel>
                        <TagCloseButton onClick={() => handleSiteDeviceRemove(unwrap(sd.deviceId))} />
                      </Tag>
                    </Box>
                  );
                })}
              </HStack>
            </Box>
          )}
        </Box>
      </FormControl>

      <FormControl id="maxiumRoutes" my={6}>
        <FormLabel>Maximum Routes</FormLabel>
        <Select
          variant="filled"
          name="maximumRoutes"
          value={siteState.maximumRoutes}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as unknown as MaximumRoutes;
            setSiteState({
              ...siteState,
              maximumRoutes: eventValue,
            });
          }}
        >
          <option value="1000">1000</option>
          <option value="2000">2000</option>
          <option value="5000">5000</option>
          <option value="10000">10000</option>
          <option value="1000000">1000000</option>
        </Select>
      </FormControl>

      <FormControl id="site-management-type" my={6}>
        <FormLabel>Site Management Type</FormLabel>
        <Select
          variant="filled"
          name="site-management-type"
          value={siteState.siteManagementType}
          onChange={(event) => {
            setSiteState({
              ...siteState,
              siteManagementType: event.target.value as SiteManagementType,
            });
          }}
        >
          <option value="provider-managed">provider-managed</option>
          <option value="co-managed">co-managed</option>
          <option value="customer-managed">customer-managed</option>
        </Select>
      </FormControl>

      <FormControl id="site-service-qos-profile" my={6}>
        <FormLabel>Site Service QOS Profile</FormLabel>
        <Autocomplete
          items={qosProfiles}
          selectedItem={siteState.siteServiceQosProfile || ''}
          onChange={handleProfileNameChange}
        />
      </FormControl>

      <FormControl id="enable-bgp-pic-fast-reroute" my={6}>
        <FormLabel>Enable BGP PIC Fast Reroute</FormLabel>
        <Select
          variant="filled"
          name="enable-bgp-pic-fast-reroute"
          disabled // requested by gamma
          value={siteState.enableBgpPicFastReroute ? '1' : '0'}
          onChange={(event) => {
            setSiteState({
              ...siteState,
              enableBgpPicFastReroute: event.target.value === '1',
            });
          }}
        >
          <option value="1">yes</option>
          <option value="0">no</option>
        </Select>
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
