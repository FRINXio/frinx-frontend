import React, { FC, FormEvent, useEffect, useState } from 'react';
import { Divider, Button, Select, Stack, FormControl, FormLabel } from '@chakra-ui/react';
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
      autonomousSystem: 0,
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
            setNetworkAccessState({
              ...networkAccessState,
              service: {
                ...networkAccessState.service,
                qosProfiles: [unwrap(event.target.value)],
              },
            });
          }}
        >
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
