import React, { FC, useEffect, useState } from 'react';
import {
  Divider,
  Box,
  Button,
  Flex,
  Grid,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { LinkIcon } from '@chakra-ui/icons';
import { FormikErrors, useFormik } from 'formik';
import * as yup from 'yup';
import { v4 as uuid } from 'uuid';
import {
  AccessPriority,
  MaximumRoutes,
  RoutingProtocol,
  VpnSite,
  SiteNetworkAccess,
  StaticRoutingTypeWithId,
  ClientSiteNetworkAccess,
  ClientRoutingProtocol,
} from './site-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import RoutingProtocolForm from './routing-protocol-form';
import unwrap from '../../helpers/unwrap';
import { getSelectOptions } from './options.helper';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { useAsyncGenerator } from '../commit-status-modal/commit-status-modal.helpers';
import { VpnService } from './service-types';
import { IPConnection } from '../../network-types';

type AddressAssign = {
  customer_address: string | null; // eslint-disable-line @typescript-eslint/naming-convention
  provider_address: string | null; // eslint-disable-line @typescript-eslint/naming-convention
};

type AddressAssignPayload = {
  response_body: AddressAssign; // eslint-disable-line @typescript-eslint/naming-convention
};

const StaticProtocolSchema = yup.object({
  lan: yup.string(),
  nextHop: yup.string(),
  lanTag: yup.number().min(0).max(65535).nullable(),
});

const BgpProtocolSchema = yup.object({
  addressFamily: yup.mixed().oneOf(['ipv4']),
  autonomousSystem: yup.string(),
  bgpProfile: yup.string().nullable(),
});

const ProtocolSchema = yup.object({
  type: yup.mixed().oneOf(['static', 'bgp']),
  vrrp: yup.string().nullable(),
  bgp: BgpProtocolSchema.nullable(),
  static: yup.array().of(StaticProtocolSchema).nullable(),
});

const RoutingProtocolSchema = yup.array().of(ProtocolSchema);

const IpConnectionSchema = yup.object({
  ipv4: yup.object({
    addresses: yup.object({
      customerAddress: yup.string().required(),
      providerAddress: yup.string().required(),
    }),
  }),
});

const NetworkAccessSchema = yup.object({
  siteNetworkAccessId: yup.string(),
  // siteNetworkAccessType: yup.mixed().oneOf(['point-to-point', 'multipoint']),
  ipConnection: IpConnectionSchema,
  accessPriority: yup.mixed().oneOf(['150', '100', '90', '80', '70', '60']),
  maximumRoutes: yup.mixed().oneOf([null, 1000, 2000, 5000, 10000]),
  routingProtocols: RoutingProtocolSchema,
  locationReference: yup.string().nullable(),
  deviceReference: yup.string().nullable(),
  vpnAttachment: yup.string().required('Vpn Attachment is required field'),
  siteRole: yup.string().nullable(),
  bearer: yup.object({
    bearerReference: yup
      .string()
      .matches(
        /(^CPNH2\d{8}-(0\d{2}|[1-9]\d{2,3})$)|(^CES\d{8}-\d{2}$)/,
        'Circuit Reference should have following format: CPNH200000000-0000 or CES00000000-00',
      )
      .required('Circuit Reference is required'),
  }),
});

type StaticRoutingProtocol = {
  type: 'static';
  static: StaticRoutingTypeWithId[];
};

type Props = {
  mode: 'add' | 'edit';
  site: VpnSite;
  selectedNetworkAccess: SiteNetworkAccess;
  qosProfiles: string[];
  bfdProfiles: string[]; // eslint-disable-line react/no-unused-prop-types
  bgpProfiles: string[];
  vpnServices: VpnService[];
  bandwidths: number[];
  onSubmit: (s: VpnSite) => void;
  onCancel: () => void;
  onReset: () => void;
};

function getDefaultStaticRoutingProtocol(): StaticRoutingProtocol {
  return {
    type: 'static',
    static: [
      {
        id: uuid(),
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

function getCustomerAddressError(errors: FormikErrors<SiteNetworkAccess>): string | null {
  return (errors?.ipConnection as unknown as IPConnection)?.ipv4?.addresses?.customerAddress || null;
}

function getProviderAddressError(errors: FormikErrors<SiteNetworkAccess>): string | null {
  return (errors?.ipConnection as unknown as IPConnection)?.ipv4?.addresses?.providerAddress || null;
}

function getClientSelectedNetworkAccess(siteNetworkAccess: SiteNetworkAccess): ClientSiteNetworkAccess {
  // we need to add ids to static routing protocols to be able to edit them
  return {
    ...siteNetworkAccess,
    routingProtocols: siteNetworkAccess.routingProtocols.map((p) => {
      const newProtocol: RoutingProtocol = { ...p };
      if (newProtocol.static) {
        newProtocol.static = newProtocol.static.map((s) => ({ ...s, id: uuid() }));
      }
      return newProtocol as ClientRoutingProtocol;
    }),
  };
}

const SiteNetAccessForm: FC<Props> = ({
  mode,
  site,
  selectedNetworkAccess,
  qosProfiles,
  bgpProfiles,
  vpnServices,
  bandwidths,
  onSubmit,
  onCancel,
  onReset,
}) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [addressAssignError, setAddressAssignError] = useState<string | null>(null);
  const onFinish = () => {
    // do nothing
  };
  const workflowPayload = useAsyncGenerator<AddressAssignPayload>({ workflowId, onFinish });
  const [siteState, setSiteState] = useState(site);
  const { values, errors, dirty, isValid, resetForm, setFieldValue, handleSubmit } = useFormik({
    initialValues: getClientSelectedNetworkAccess(selectedNetworkAccess),
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

  useEffect(() => {
    if (workflowId === workflowPayload?.workflowId && workflowPayload?.status === 'COMPLETED') {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { provider_address, customer_address } = workflowPayload.output.response_body;
      setWorkflowId(null);

      // any of the empty address in result is condidered as error
      if (!provider_address || !customer_address) {
        setAddressAssignError('Addresses were already assigned.');
        return;
      }
      setFieldValue('ipConnection', {
        ...values.ipConnection,
        ipv4: {
          ...values.ipConnection?.ipv4,
          addresses: {
            ...values.ipConnection?.ipv4?.addresses,
            providerAddress: provider_address || undefined,
            customerAddress: customer_address || undefined,
          },
        },
      });
    }
  }, [workflowPayload, workflowId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleAddressAssign = async (siteNetworkAccessId: string, prefixLength?: number) => {
    if (!prefixLength) {
      return;
    }

    setAddressAssignError(null);

    const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
    const workflowResult = await uniflowCallbacks.executeWorkflow({
      name: 'Allocate_Addresses',
      version: 1,
      input: {
        site: siteNetworkAccessId, // FIX: backend should rename this property in workflow
        prefix_length: values.ipConnection?.ipv4?.addresses?.prefixLength || 31, // eslint-disable-line @typescript-eslint/naming-convention
      },
    });

    setWorkflowId(workflowResult.text);
  };

  const handleReset = () => {
    resetForm();
    onReset();
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

  const vpnServicesItems = vpnServices.map((service) => {
    return { value: unwrap(service.vpnId), label: `${service.vpnId} (${service.customerName})` };
  });
  const [selectedVpnServiceItem] = vpnServicesItems.filter((item) => item.value === values.vpnAttachment);
  const staticRoutingProtocol =
    (values.routingProtocols.filter((p) => p.type === 'static').pop() as StaticRoutingProtocol) ||
    getDefaultStaticRoutingProtocol();
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

  const customerAddressError = getCustomerAddressError(errors);
  const providerAddressError = getProviderAddressError(errors);

  return (
    <form onSubmit={handleSubmit}>
      <Box paddingTop="6">
        <Heading size="sm">General</Heading>
        <Grid templateColumns="repeat(4, 1fr)" gap="1">
          <FormControl id="vpn-attachment" my={1} isRequired isInvalid={errors.vpnAttachment != null}>
            <FormLabel>VPN Attachment</FormLabel>
            <Autocomplete2
              items={vpnServicesItems}
              selectedItem={selectedVpnServiceItem}
              onChange={handleVpnAttachmentChange}
            />
            {errors.vpnAttachment && <FormErrorMessage>{errors.vpnAttachment}</FormErrorMessage>}
          </FormControl>

          <FormControl id="site-role" my={1}>
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

          <FormControl id="bearer-reference" my={1} isInvalid={errors.bearer?.bearerReference != null}>
            <FormLabel>BMT Circuit Reference</FormLabel>
            <Input
              placeholder="CPNH200000000-0000 or CES00000000-00"
              name="bearerReference"
              value={values.bearer.bearerReference}
              onChange={(event) => {
                setFieldValue('bearer', {
                  ...values.bearer,
                  bearerReference: event.target.value,
                });
              }}
            />
            {errors.bearer?.bearerReference && <FormErrorMessage>{errors.bearer.bearerReference}</FormErrorMessage>}
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
            <FormControl id="location-id" my={1}>
              <FormLabel>Locations</FormLabel>
              <Autocomplete2 items={locationItems} selectedItem={selectedLocation} onChange={handleLocationChange} />
            </FormControl>
          ) : (
            <FormControl id="device-id" my={1}>
              <FormLabel>Devices</FormLabel>
              <Autocomplete2 items={deviceItems} selectedItem={selectedDevice} onChange={handleDeviceChange} />
            </FormControl>
          )}

          <FormControl id="bearer-c-vlan" my={1}>
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

          <FormControl id="maximum-routes" my={1}>
            <FormLabel>Maximum Routes</FormLabel>{' '}
            <Select
              name="maximumRoutes"
              value={values.maximumRoutes || ''}
              onChange={(event) => {
                setFieldValue('maximumRoutes', (Number(event.target.value) as MaximumRoutes) || null);
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

          <FormControl id="access-priority" my={1}>
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
        </Grid>

        <Box paddingTop={6}>
          <Heading size="sm">Service</Heading>
          <Grid templateColumns="repeat(4, 1fr)" gap="1">
            <FormControl id="svc-input-bandwidth" my={1}>
              <FormLabel>SVC Input Bandwidth</FormLabel>
              <Select
                name="svcInputBandwith"
                value={values.service?.svcInputBandwidth || bandwidths[0]}
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

            <FormControl id="svc-output-bandwidth" my={1}>
              <FormLabel>SVC Output Bandwidth</FormLabel>
              <Select
                name="svcOutputBandwith"
                value={values.service?.svcOutputBandwidth || bandwidths[0]}
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

            <FormControl id="qosProfile" my={1}>
              <FormLabel>QOS Profile</FormLabel>
              <Select
                name="qos-profile"
                value={values.service?.qosProfiles[0] || ''}
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
          </Grid>
        </Box>

        <Box paddingTop={6}>
          <Heading size="sm">Routing Protocol</Heading>
          <Grid templateColumns="repeat(4, 1fr)" gap="1">
            <RoutingProtocolForm
              errors={errors}
              bgpProfileItems={bgpProfileItems}
              selectedBgpProfileItem={selectedBgpProfileItem}
              bgpProtocol={bgpRoutingProtocol}
              staticProtocol={staticRoutingProtocol}
              onRoutingProtocolsChange={handleRoutingProtocolsChange}
            />
          </Grid>
        </Box>

        <Box paddingTop={6}>
          <Heading size="sm">IP Connection</Heading>
          <Grid templateColumns="repeat(4, 1fr)" gap="1">
            {/* FD-190 hidden on gamma request */}
            {/* <FormControl id="ip-address-allocation-type" my={1} isReadOnly>
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
            </FormControl> */}
            <FormControl id="ip-prefix-length">
              <FormLabel>
                <Flex justifyContent="space-between" alignItems="flex-start">
                  <Text>Prefix Length</Text>
                  {workflowId && (
                    <Flex alignItems="center">
                      <Text paddingRight={1} color="blackAlpha.600" fontSize="sm" as="i">
                        Fetching Addresses
                      </Text>
                      <Spinner size="sm" />
                    </Flex>
                  )}
                </Flex>
              </FormLabel>
              <Flex alignItems="center">
                <Select
                  name="prefixLength"
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
                >
                  <option value="">-- choose value</option>
                  <option value={30}>30</option>
                  <option value={31}>31</option>
                  );
                </Select>
                <IconButton
                  marginLeft="1"
                  size="md"
                  aria-label="Deselect Customer Name"
                  icon={<LinkIcon />}
                  onClick={() =>
                    handleAddressAssign(values.siteNetworkAccessId, ipv4Connection.addresses?.prefixLength)
                  }
                  isDisabled={ipv4Connection.addresses?.prefixLength === undefined || workflowId !== null}
                />
              </Flex>
            </FormControl>
            <FormControl
              id="ip-provider-address"
              my={1}
              isInvalid={providerAddressError != null}
              isDisabled={workflowId !== null}
            >
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
              {providerAddressError != null && <FormErrorMessage>{providerAddressError}</FormErrorMessage>}
              {addressAssignError !== null && (
                <Text fontSize="sm" color="red">
                  {addressAssignError}
                </Text>
              )}
            </FormControl>
            <FormControl
              id="ip-customer-address"
              my={1}
              isInvalid={customerAddressError != null}
              isDisabled={workflowId !== null}
            >
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
              {customerAddressError != null && <FormErrorMessage>{customerAddressError}</FormErrorMessage>}
            </FormControl>
          </Grid>
        </Box>
      </Box>

      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!dirty || workflowId !== null || !isValid}>
          Save changes
        </Button>
        <Button onClick={handleReset}>Clear</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default SiteNetAccessForm;
