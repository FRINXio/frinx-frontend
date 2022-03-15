import React, { FC } from 'react';
import { Divider, Button, Select, Stack, FormControl, FormLabel } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SiteManagementType, VpnSite, MaximumRoutes } from './site-types';
import Autocomplete2 from '../autocomplete-2/autocomplete-2';
import { getSelectOptions } from './options.helper';

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
  maximumRoutes: yup.mixed().oneOf([null, 1000, 2000, 5000, 10000, 1000000]),
});

type Props = {
  site: VpnSite;
  qosProfiles: string[];
  onSubmit: (s: VpnSite) => void;
  onCancel: () => void;
};

const VpnSiteForm: FC<Props> = ({ site, qosProfiles, onSubmit, onCancel }) => {
  const { values, errors, dirty, resetForm, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      ...site,
    },
    validationSchema: SiteSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

  const qosProfileItems = qosProfiles.map((p) => ({
    value: p,
    label: p,
  }));

  const [selectedProfile] = qosProfileItems.filter((p) => {
    return p.value === values.siteServiceQosProfile;
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="maxiumRoutes" my={6}>
        <FormLabel>Maximum Routes</FormLabel>
        <Select
          name="maximumRoutes"
          value={values.maximumRoutes || ''}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as unknown as MaximumRoutes;
            setFieldValue('maximumRoutes', Number(eventValue) || null);
          }}
        >
          <option value="">-- choose maximum routes</option>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site.maximum_routes).map((item) => {
            return (
              <option key={`maximum-routes-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl id="site-management-type" my={6} isRequired isInvalid={errors.siteManagementType != null}>
        <FormLabel>Site Management Type</FormLabel>
        <Select
          name="site-management-type"
          value={values.siteManagementType}
          onChange={(event) => {
            const value = event.target.value as SiteManagementType;
            setFieldValue('siteManagementType', value);
          }}
        >
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site.site_management).map((item) => {
            return (
              <option key={`site-management-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl id="site-service-qos-profile" my={6}>
        <FormLabel>Site Service QOS Profile</FormLabel>
        <Autocomplete2
          items={qosProfileItems}
          selectedItem={selectedProfile}
          onChange={(item) => {
            setFieldValue('siteServiceQosProfile', item ? item.value : '');
          }}
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
        <Button type="submit" colorScheme="blue" isDisabled={!dirty}>
          Save changes
        </Button>
        <Button onClick={() => resetForm()}>Clear</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default VpnSiteForm;
