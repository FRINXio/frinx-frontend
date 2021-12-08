import React, { FC, useEffect, useState } from 'react';
import {
  Divider,
  Button,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  Stack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AccessPriority, MaximumRoutes, RoutingProtocol, VpnSite, SiteNetworkAccess } from './site-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import RoutingProtocolForm from './routing-protocol-form';
import unwrap from '../../helpers/unwrap';
import { getSelectOptions } from './options.helper';

// const RoutingProtocolSchema = yup.array().of(yup.object({}));

const NetworkAccessSchema = yup.object({
  siteNetworkAccessId: yup.string(),
  // siteNetworkAccessType: yup.mixed().oneOf(['point-to-point', 'multipoint']),
  // ipConnection?: IPConnection;
  accessPriority: yup.mixed().oneOf(['150', '100', '90', '80', '70', '60']),
  maximumRoutes: yup.mixed().oneOf([1000, 2000, 5000, 10000]),
  // routingProtocols: RoutingProtocolSchema,
  locationReference: yup.string().nullable(),
  deviceReference: yup.string().nullable(),
  vpnAttachment: yup.string().required('Vpn Attachment is required field'),
  siteRole: yup.string().nullable(),
});

type Props = {
  mode: 'add' | 'edit';
  sites: VpnSite[];
  site: VpnSite;
  selectedNetworkAccess: SiteNetworkAccess;
  qosProfiles: string[];
  bfdProfiles: string[];
  bgpProfiles: string[];
  vpnIds: string[];
  bandwidths: number[];
  onSubmit: (s: VpnSite) => void;
  onCancel: () => void;
  onNetworkAccessChange?: (s: SiteNetworkAccess) => void;
};

function getDefaultStaticRoutingProtocol(): RoutingProtocol {
  return {
    type: 'static',
    static: [
      {
        lan: '',
        nextHop: '',
        lanTag: null,
      },
    ],
  };
}

function getDefaultBgpRoutingProtocol(): RoutingProtocol {
  return {
    type: 'bgp',
    bgp: {
      addressFamily: 'ipv4',
      autonomousSystem: '',
      bgpProfile: null,
    },
  };
}

function getEditedNetworkAccesses(
  networkAccesses: SiteNetworkAccess[],
  editedNetworkAccess: SiteNetworkAccess,
): SiteNetworkAccess[] {
  const oldNetworkAccesses = [...networkAccesses];

  return oldNetworkAccesses.map((access) => {
    return access.siteNetworkAccessId === editedNetworkAccess.siteNetworkAccessId ? editedNetworkAccess : access;
  });
}

const SiteNetAccessForm: FC<Props> = ({
  mode,
  site,
  selectedNetworkAccess,
  qosProfiles,
  bgpProfiles,
  vpnIds,
  bandwidths,
  onSubmit,
  onCancel,
}) => {
  const [siteState, setSiteState] = useState(site);
  const { values, errors, dirty, resetForm, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      ...selectedNetworkAccess,
    },
    validationSchema: NetworkAccessSchema,
    onSubmit: (formValues) => {
      if (!formValues) {
        return;
      }
      const oldNetworkAccesses = siteState.siteNetworkAccesses || [];
      const newNetworkAccesses =
        mode === 'add' ? [...oldNetworkAccesses, formValues] : getEditedNetworkAccesses(oldNetworkAccesses, formValues);
      onSubmit({
        ...siteState,
        siteNetworkAccesses: newNetworkAccesses,
      });
    },
  });

  useEffect(() => {
    setSiteState({
      ...site,
    });
  }, [site]);

  const handleLocationChange = (item?: Item | null) => {
    setFieldValue('locationReference', unwrap(item).value);
  };

  const handleDeviceChange = (item?: Item | null) => {
    setFieldValue('deviceReference', unwrap(item).value);
  };

  const handleRoutingProtocolsChange = (routingProtocols: RoutingProtocol[]) => {
    setFieldValue('routingProtocols', routingProtocols);
  };

  const handleVpnAttachmentChange = (item?: Item | null) => {
    setFieldValue('vpnAttachment', item ? item.value : null);
  };

  const locationItems = siteState.customerLocations.map((l) => {
    const id = unwrap(l.locationId);
    return {
      value: id,
      label: id,
    };
  });
  const [selectedLocation] = locationItems.filter((item) => item.value === values.locationReference);

  const deviceItems = siteState.siteDevices.map((d) => {
    const id = unwrap(d.deviceId);
    return {
      value: id,
      label: id,
    };
  });
  const [selectedDevice] = deviceItems.filter((item) => item.value === values.deviceReference);

  const vpnServicesItems = vpnIds.map((id) => {
    return { value: id, label: id };
  });
  const [selectedVpnServiceItem] = vpnServicesItems.filter((item) => item.value === values.vpnAttachment);
  const staticRoutingProtocol =
    values.routingProtocols.filter((p) => p.type === 'static').pop() || getDefaultStaticRoutingProtocol();
  const bgpRoutingProtocol =
    values.routingProtocols.filter((p) => p.type === 'bgp').pop() || getDefaultBgpRoutingProtocol();

  const bgpProfileItems = bgpProfiles.map((p) => {
    return {
      label: p,
      value: p,
    };
  });
  const [selectedBgpProfileItem] = bgpProfileItems.filter((i) => i.value === bgpRoutingProtocol.bgp?.bgpProfile);

  const ipv4Connection = unwrap(unwrap(values.ipConnection).ipv4);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="vpn-attachment" my={6} isRequired isInvalid={errors.vpnAttachment != null}>
        <FormLabel>Vpn Attachment</FormLabel>
        <Autocomplete2
          items={vpnServicesItems}
          selectedItem={selectedVpnServiceItem}
          onChange={handleVpnAttachmentChange}
        />
        {errors.vpnAttachment && <FormErrorMessage>{errors.vpnAttachment}</FormErrorMessage>}
      </FormControl>

      <FormControl id="site-role" my={6}>
        <FormLabel>Site role</FormLabel>
        <Select
          isDisabled
          name="siteRole"
          value={values.siteRole || ''}
          onChange={(event) => {
            setFieldValue('siteRole', event.target.value || null);
          }}
        >
          <option value="">-- choose site role</option>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site_network_access.site_role).map((item) => {
            return (
              <option key={`evc-type-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl id="bearer-reference" my={6}>
        <FormLabel>Bearer Reference</FormLabel>
        <Input
          name="bearerReference"
          value={values.bearer.bearerReference}
          onChange={(event) => {
            setFieldValue('bearer', {
              ...values.bearer,
              bearerReference: event.target.value,
            });
          }}
        />
      </FormControl>

      {/* INFO: field is hidden by request from gamma */}
      {/* <FormControl id="service-network-access-type" my={6}>
        <FormLabel>Service Network Access Type</FormLabel>
        <Select
          name="service-network-access-type"
          value={networkAccessState.siteNetworkAccessType}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            console.log(event.target.value);
            setNetworkAccessState({
              ...networkAccessState,
              siteNetworkAccessType: event.target.value as SiteNetworkAccessType,
            });
          }}
        >
          <option value="point-to-point">point-to-point</option>
          <option value="multipoint">multipoint</option>
        </Select>
        </FormControl>
      */}

      {siteState.siteManagementType === 'customer-managed' ? (
        <FormControl id="location-id" my={6}>
          <FormLabel>Locations</FormLabel>
          <Autocomplete2 items={locationItems} selectedItem={selectedLocation} onChange={handleLocationChange} />
        </FormControl>
      ) : (
        <FormControl id="device-id" my={6}>
          <FormLabel>Devices</FormLabel>
          <Autocomplete2 items={deviceItems} selectedItem={selectedDevice} onChange={handleDeviceChange} />
        </FormControl>
      )}

      <FormControl id="bearer-c-vlan" my={6}>
        <FormLabel>Bearer - Requested C Vlan</FormLabel>
        <Select
          name="bearer-c-vlan"
          value={values.bearer.requestedCLan}
          onChange={(event) => {
            setFieldValue('bearer', {
              ...values.bearer,
              requestedCLan: event.target.value,
            });
          }}
        >
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site_network_access.requested_cvlan).map((item) => {
            return (
              <option key={`requested-cvlan-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl id="svc-input-bandwidth" my={6}>
        <FormLabel>SVC Input Bandwidth</FormLabel>
        <Select
          name="svcInputBandwith"
          type="number"
          value={values.service.svcInputBandwidth}
          onChange={(event) => {
            setFieldValue('service', {
              ...values.service,
              svcInputBandwidth: Number(event.target.value),
            });
          }}
        >
          {bandwidths.map((b) => (
            <option key={`input-bandwith-key-${b}`}>{b}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl id="svc-output-bandwidth" my={6}>
        <FormLabel>SVC Output Bandwidth</FormLabel>
        <Select
          name="svcOutputBandwith"
          value={values.service.svcOutputBandwidth}
          onChange={(event) => {
            setFieldValue('service', {
              ...values.service,
              svcOutputBandwidth: Number(event.target.value),
            });
          }}
        >
          {bandwidths.map((b) => (
            <option key={`output-bandwith-key-${b}`}>{b}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl id="qosProfile" my={6}>
        <FormLabel>QOS Profile</FormLabel>
        <Select
          name="qos-profile"
          value={values.service.qosProfiles[0]}
          onChange={(event) => {
            if (!event.target.value) {
              return;
            }
            setFieldValue('service', {
              ...values.service,
              qosProfiles: [unwrap(event.target.value)],
            });
          }}
        >
          <option value="0">--- choose profile</option>
          {qosProfiles.map((p) => (
            <option key={`qos-profile-${p}`} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl id="maximum-routes" my={6}>
        <FormLabel>Maximum Routes</FormLabel>{' '}
        <Select
          name="maximumRoutes"
          value={values.maximumRoutes}
          onChange={(event) => {
            setFieldValue('maximumRoutes', Number(event.target.value) as MaximumRoutes);
          }}
        >
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site.maximum_routes).map((item) => {
            return (
              <option key={`maximum-routes-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <RoutingProtocolForm
        bgpProfileItems={bgpProfileItems}
        selectedBgpProfileItem={selectedBgpProfileItem}
        bgpProtocol={bgpRoutingProtocol}
        staticProtocol={staticRoutingProtocol}
        onRoutingProtocolsChange={handleRoutingProtocolsChange}
      />

      <FormControl id="access-priority" my={6}>
        <FormLabel>Access Priority</FormLabel>
        <Select
          name="accessPriority"
          value={values.accessPriority}
          onChange={(event) => {
            setFieldValue('accessPriority', event.target.value as unknown as AccessPriority);
          }}
        >
          {[...Object.entries(AccessPriority)].map((e) => {
            const [k, v] = e;
            return (
              <option key={k} value={v}>
                {k}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <Heading size="sm">IP Connection</Heading>
      <FormControl id="ip-address-allocation-type" my={6}>
        <FormLabel>Address Allocation Type</FormLabel>
        <Input
          name="ip-address-allocation-type"
          value={ipv4Connection.addressAllocationType?.split(':').pop() || ''}
          onChange={(event) => {
            setFieldValue('ipConnection', {
              ...values.ipConnection,
              ipv4: {
                ...values.ipConnection?.ipv4,
                addressAllocationType: event.target.value || undefined,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="ip-provider-address" my={6}>
        <FormLabel>Provider Address</FormLabel>
        <Input
          name="providerAddress"
          value={ipv4Connection.addresses?.providerAddress || ''}
          onChange={(event) => {
            setFieldValue('ipConnection', {
              ...values.ipConnection,
              ipv4: {
                ...values.ipConnection?.ipv4,
                addresses: {
                  ...values.ipConnection?.ipv4?.addresses,
                  providerAddress: event.target.value || undefined,
                },
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="ip-customer-address" my={6}>
        <FormLabel>Customer Address</FormLabel>
        <Input
          name="customer-address"
          value={ipv4Connection.addresses?.customerAddress || ''}
          onChange={(event) => {
            setFieldValue('ipConnection', {
              ...values.ipConnection,
              ipv4: {
                ...values.ipConnection?.ipv4,
                addresses: {
                  ...values.ipConnection?.ipv4?.addresses,
                  customerAddress: event.target.value || undefined,
                },
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="ip-prefix-length" my={6}>
        <FormLabel>Prefix Length</FormLabel>
        <Input
          name="prefix-length"
          value={ipv4Connection.addresses?.prefixLength || ''}
          onChange={(event) => {
            if (Number.isNaN(event.target.value)) {
              return;
            }
            setFieldValue('ipConnection', {
              ...values.ipConnection,
              ipv4: {
                ...values.ipConnection?.ipv4,
                addresses: {
                  ...values.ipConnection?.ipv4?.addresses,
                  prefixLength: Number(event.target.value) || undefined,
                },
              },
            });
          }}
        />
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

export default SiteNetAccessForm;
