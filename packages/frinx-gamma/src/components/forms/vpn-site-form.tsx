import React, { FC } from 'react';
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
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SiteDevice, SiteManagementType, VpnSite, MaximumRoutes } from './site-types';
import SiteDeviceForm from './site-device-form';
import Autocomplete from '../autocomplete/autocomplete';
import unwrap from '../../helpers/unwrap';

const DeviceSchema = yup.object().shape({
  deviceId: yup.string().required(),
  managementIP: yup.string().required(),
  locationId: yup.string().required(),
});

const SiteSchema = yup.object().shape({
  // customerLocations: yup.array(),
  siteDevices: yup.array().of(DeviceSchema),
  siteManagementType: yup.mixed().oneOf(['point-to-point', 'provider-managed', 'co-managed', 'customer-managed']),
  // siteVpnFlavor: yup.mixed().oneOf(['site-vpn-flavor-single', 'site-vpn-flavor-sub', 'site-vpn-flavor-nni']),
  siteServiceQosProfile: yup.string().nullable(),
  enableBgpPicFastReroute: yup.boolean().required('Enable BgpPicFast Reroute is required'),
  // siteNetworkAccesses: yup.array(),
  maximumRoutes: yup.mixed().oneOf(['1000', '2000', '5000', '10000', '1000000']),
});

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
  const { values, errors, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      ...site,
    },
    validationSchema: SiteSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

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
    if (values.siteDevices.filter((d) => d.deviceId === device.deviceId).length) {
      return;
    }

    const newSiteDevices = [...values.siteDevices, device];
    setFieldValue('siteDevices', newSiteDevices);
  };

  const handleSiteDeviceRemove = (deviceId: string) => {
    const newSiteDevices = values.siteDevices.filter((sd) => sd.deviceId !== deviceId);
    setFieldValue('siteDevices', newSiteDevices);
  };

  const handleProfileNameChange = (profileName: string) => {
    setFieldValue('siteServiceQosProfile', profileName);
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
          {values.siteDevices.length > 0 && (
            <Box>
              <HStack>
                {values.siteDevices.map((sd) => {
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
          name="maximumRoutes"
          value={values.maximumRoutes}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as unknown as MaximumRoutes;
            setFieldValue('maximumRoutes', eventValue);
          }}
        >
          <option value={1000}>1000</option>
          <option value={2000}>2000</option>
          <option value={5000}>5000</option>
          <option value={10000}>10000</option>
          <option value={1000000}>1000000</option>
        </Select>
      </FormControl>

      <FormControl id="site-management-type" my={6} isRequired isInvalid={errors.siteManagementType != null}>
        <FormLabel>Site Management Type</FormLabel>
        <Select
          name="site-management-type"
          value={values.siteManagementType}
          disabled
          onChange={(event) => {
            const value = event.target.value as SiteManagementType;
            setFieldValue('siteManagementType', value);
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
          selectedItem={values.siteServiceQosProfile || ''}
          onChange={handleProfileNameChange}
        />
      </FormControl>

      <FormControl id="enable-bgp-pic-fast-reroute" my={6} isRequired isInvalid={errors.siteServiceQosProfile != null}>
        <FormLabel>Enable BGP PIC Fast Reroute</FormLabel>
        <Select
          name="enable-bgp-pic-fast-reroute"
          disabled // requested by gamma
          value={values.enableBgpPicFastReroute ? '1' : '0'}
          onChange={(event) => {
            setFieldValue('enableBgpPicFastReroute', event.target.value === '1');
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
