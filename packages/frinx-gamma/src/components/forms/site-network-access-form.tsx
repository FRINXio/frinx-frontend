import React, { FC, FormEvent, useEffect, useState } from 'react';
import { Divider, Button, Heading, Input, Select, Stack, FormControl, FormLabel } from '@chakra-ui/react';
import {
  AccessPriority,
  MaximumRoutes,
  RoutingProtocol,
  VpnSite,
  SiteNetworkAccess,
  RequestedCVlan,
} from './site-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import RoutingProtocolForm from './routing-protocol-form';
import unwrap from '../../helpers/unwrap';

type Props = {
  mode: 'add' | 'edit';
  sites: VpnSite[];
  site: VpnSite;
  selectedNetworkAccess: SiteNetworkAccess | null;
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
  const [networkAccessState, setNetworkAccessState] = useState(selectedNetworkAccess);

  useEffect(() => {
    setSiteState({
      ...site,
    });
  }, [site]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!networkAccessState) {
      return;
    }
    const oldNetworkAccesses = siteState.siteNetworkAccesses || [];
    const newNetworkAccesses =
      mode === 'add'
        ? [...oldNetworkAccesses, networkAccessState]
        : getEditedNetworkAccesses(oldNetworkAccesses, networkAccessState);
    onSubmit({
      ...siteState,
      siteNetworkAccesses: newNetworkAccesses,
    });
  };

  const handleLocationChange = (item?: Item | null) => {
    if (networkAccessState) {
      setNetworkAccessState({
        ...networkAccessState,
        locationReference: unwrap(item).value,
      });
    }
  };

  const handleDeviceChange = (item?: Item | null) => {
    if (networkAccessState) {
      setNetworkAccessState({
        ...networkAccessState,
        deviceReference: unwrap(item).value,
      });
    }
  };

  const handleRoutingProtocolsChange = (routingProtocols: RoutingProtocol[]) => {
    if (networkAccessState) {
      setNetworkAccessState({
        ...networkAccessState,
        routingProtocols,
      });
    }
  };

  const handleVpnAttachmentChange = (item?: Item | null) => {
    if (!networkAccessState) {
      return;
    }
    setNetworkAccessState({
      ...networkAccessState,
      vpnAttachment: item ? item.value : null,
    });
  };

  if (!networkAccessState) {
    return null;
  }

  const locationItems = siteState.customerLocations.map((l) => {
    const id = unwrap(l.locationId);
    return {
      value: id,
      label: id,
    };
  });
  const [selectedLocation] = locationItems.filter((item) => item.value === networkAccessState.locationReference);

  const deviceItems = siteState.siteDevices.map((d) => {
    const id = unwrap(d.deviceId);
    return {
      value: id,
      label: id,
    };
  });
  const [selectedDevice] = deviceItems.filter((item) => item.value === networkAccessState.deviceReference);

  const vpnServicesItems = vpnIds.map((id) => {
    return { value: id, label: id };
  });
  const [selectedVpnServiceItem] = vpnServicesItems.filter((item) => item.value === networkAccessState.vpnAttachment);
  const staticRoutingProtocol =
    networkAccessState.routingProtocols.filter((p) => p.type === 'static').pop() || getDefaultStaticRoutingProtocol();
  const bgpRoutingProtocol =
    networkAccessState.routingProtocols.filter((p) => p.type === 'bgp').pop() || getDefaultBgpRoutingProtocol();

  const bgpProfileItems = bgpProfiles.map((p) => {
    return {
      label: p,
      value: p,
    };
  });
  const [selectedBgpProfileItem] = bgpProfileItems.filter((i) => i.value === bgpRoutingProtocol.bgp?.bgpProfile);

  const ipv4Connection = unwrap(unwrap(networkAccessState.ipConnection).ipv4);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="vpn-attachment" my={6}>
        <FormLabel>Vpn Attachment</FormLabel>
        <Autocomplete2
          items={vpnServicesItems}
          selectedItem={selectedVpnServiceItem}
          onChange={handleVpnAttachmentChange}
        />
      </FormControl>

      <FormControl id="site-role" my={6}>
        <FormLabel>Site role</FormLabel>
        <Select
          variant="filled"
          name="site-role"
          value={networkAccessState.siteRole || ''}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            console.log(event.target.value);
            setNetworkAccessState({
              ...networkAccessState,
              siteRole: event.target.value || null,
            });
          }}
        >
          <option value="">-- choose site role</option>
          <option value="any-to-any-role">any-any</option>
          <option value="hub-role">hub</option>
          <option value="spoke-role">spoke</option>
        </Select>
      </FormControl>

      <FormControl id="bearer-reference" my={6}>
        <FormLabel>Bearer Reference</FormLabel>
        <Input
          variant="filled"
          name="bearer-reference"
          value={networkAccessState.bearer.bearerReference}
          onChange={(event) => {
            setNetworkAccessState({
              ...networkAccessState,
              bearer: {
                ...networkAccessState.bearer,
                bearerReference: event.target.value,
              },
            });
          }}
        />
      </FormControl>

      {/* INFO: field is hidden by request from gamma */}
      {/* <FormControl id="service-network-access-type" my={6}>
        <FormLabel>Service Network Access Type</FormLabel>
        <Select
          variant="filled"
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
          variant="filled"
          name="bearer-c-vlan"
          value={networkAccessState.bearer.requestedCLan}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            console.log(event.target.value);
            setNetworkAccessState({
              ...networkAccessState,
              bearer: {
                ...networkAccessState.bearer,
                requestedCLan: event.target.value as unknown as RequestedCVlan,
              },
            });
          }}
        >
          {[...Object.entries(RequestedCVlan)].map((e) => {
            const [k, v] = e;
            return (
              <option key={k} value={v}>
                {k}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl id="svc-input-bandwidth" my={6}>
        <FormLabel>SVC Input Bandwidth</FormLabel>
        <Select
          variant="filled"
          name="svc-input-bandwith"
          type="number"
          value={networkAccessState.service.svcInputBandwidth}
          onChange={(event) => {
            setNetworkAccessState({
              ...networkAccessState,
              service: {
                ...networkAccessState.service,
                svcInputBandwidth: Number(event.target.value),
              },
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
          variant="filled"
          name="svc-output-bandwith"
          value={networkAccessState.service.svcOutputBandwidth}
          onChange={(event) => {
            setNetworkAccessState({
              ...networkAccessState,
              service: {
                ...networkAccessState.service,
                svcOutputBandwidth: Number(event.target.value),
              },
            });
          }}
        >
          {bandwidths.map((b) => (
            <option key={`output-bandwith-key-${b}`}>{b}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl id="qos-profile" my={6}>
        <FormLabel>QOS Profile</FormLabel>
        <Select
          variant="filled"
          name="qos-profile"
          value={networkAccessState.service.qosProfiles[0]}
          onChange={(event) => {
            if (!event.target.value) {
              return;
            }
            setNetworkAccessState({
              ...networkAccessState,
              service: {
                ...networkAccessState.service,
                qosProfiles: [unwrap(event.target.value)],
              },
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
          variant="filled"
          name="maximum-routes"
          value={networkAccessState.maximumRoutes}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            console.log(event.target.value);
            setNetworkAccessState({
              ...networkAccessState,
              maximumRoutes: Number(event.target.value) as MaximumRoutes,
            });
          }}
        >
          <option value="1000">1000</option>
          <option value="2000">2000</option>
          <option value="5000">5000</option>
          <option value="10000">10000</option>
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
          variant="filled"
          name="access-priority"
          value={networkAccessState.accessPriority}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            console.log(event.target.value);
            setNetworkAccessState({
              ...networkAccessState,
              accessPriority: event.target.value as unknown as AccessPriority,
            });
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
          variant="filled"
          name="ip-address-allocation-type"
          value={ipv4Connection.addressAllocationType?.split(':').pop()}
          onChange={(event) => {
            setNetworkAccessState({
              ...networkAccessState,
              ipConnection: {
                ...networkAccessState.ipConnection,
                ipv4: {
                  ...networkAccessState.ipConnection?.ipv4,
                  addressAllocationType: event.target.value || undefined,
                },
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="ip-provider-address" my={6}>
        <FormLabel>Provider Address</FormLabel>
        <Input
          variant="filled"
          name="provider-address"
          value={ipv4Connection.addresses?.providerAddress}
          onChange={(event) => {
            setNetworkAccessState({
              ...networkAccessState,
              ipConnection: {
                ...networkAccessState.ipConnection,
                ipv4: {
                  ...networkAccessState.ipConnection?.ipv4,
                  addresses: {
                    ...networkAccessState.ipConnection?.ipv4?.addresses,
                    providerAddress: event.target.value || undefined,
                  },
                },
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="ip-customer-address" my={6}>
        <FormLabel>Customer Address</FormLabel>
        <Input
          variant="filled"
          name="customer-address"
          value={ipv4Connection.addresses?.customerAddress}
          onChange={(event) => {
            setNetworkAccessState({
              ...networkAccessState,
              ipConnection: {
                ...networkAccessState.ipConnection,
                ipv4: {
                  ...networkAccessState.ipConnection?.ipv4,
                  addresses: {
                    ...networkAccessState.ipConnection?.ipv4?.addresses,
                    customerAddress: event.target.value || undefined,
                  },
                },
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="ip-prefix-length" my={6}>
        <FormLabel>Prefix Length</FormLabel>
        <Input
          variant="filled"
          name="prefix-length"
          value={ipv4Connection.addresses?.prefixLength || ''}
          onChange={(event) => {
            if (Number.isNaN(event.target.value)) {
              return;
            }
            setNetworkAccessState({
              ...networkAccessState,
              ipConnection: {
                ...networkAccessState.ipConnection,
                ipv4: {
                  ...networkAccessState.ipConnection?.ipv4,
                  addresses: {
                    ...networkAccessState.ipConnection?.ipv4?.addresses,
                    prefixLength: Number(event.target.value) || undefined,
                  },
                },
              },
            });
          }}
        />
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

export default SiteNetAccessForm;
