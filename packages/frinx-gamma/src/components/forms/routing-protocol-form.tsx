import React, { VoidFunctionComponent } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { RoutingProtocol } from './site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  staticProtocol: RoutingProtocol;
  bgpProtocol: RoutingProtocol;
  bgpProfileItems: Item[];
  selectedBgpProfileItem: Item;
  onRoutingProtocolsChange: (routingProtcols: RoutingProtocol[]) => void;
};

const RoutingProtocolForm: VoidFunctionComponent<Props> = ({
  staticProtocol,
  bgpProtocol,
  bgpProfileItems,
  selectedBgpProfileItem,
  onRoutingProtocolsChange,
}) => {
  const handleBgpProfileChange = (item?: Item | null) => {
    const oldBgpRoutingProtocol = unwrap(bgpProtocol.bgp);
    const newBgpRoutingProtocol: RoutingProtocol = {
      type: 'bgp',
      bgp: {
        ...oldBgpRoutingProtocol,
        bgpProfile: item ? item?.value : null,
      },
    };
    const newProtocols = [newBgpRoutingProtocol, staticProtocol];
    onRoutingProtocolsChange(newProtocols);
  };

  return (
    <>
      {/* INFO: removed on gamma request
          should be automatically recognized based on bgp and static inputs
      */}
      {/* <FormControl id="routing-protocol-type" my={6}>
        <FormLabel>Routing Protocol Type</FormLabel>{' '}
        <Select
          variant="filled"
          name="routing-protocol-type"
          value={networkAccessState.routingProtocols[0].type}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            console.log(event.target.value);
            setNetworkAccessState({
              ...networkAccessState,
              routingProtocols: [
                { ...networkAccessState.routingProtocols[0], type: event.target.value as RoutingProtocolType },
              ],
            });
          }}
        >
          <option value="static">static</option>
          <option value="bgp">bgp</option>
        </Select>
      </FormControl> */}
      <FormControl id="static-routing-lan" my={6}>
        <FormLabel>Static Routing LAN</FormLabel>
        <Input
          variant="filled"
          name="static-routing-lan"
          value={staticProtocol ? unwrap(staticProtocol.static)[0].lan : ''}
          onChange={(event) => {
            const { value } = event.target;
            const [oldStaticRoutingProtocol] = unwrap(staticProtocol.static);
            const newStaticProtocol: RoutingProtocol = {
              type: 'static',
              static: [
                {
                  ...oldStaticRoutingProtocol,
                  lan: value,
                },
              ],
            };
            const newProtocols = [bgpProtocol, newStaticProtocol];
            onRoutingProtocolsChange(newProtocols);
          }}
        />
      </FormControl>

      <FormControl id="static-routing-next-hop" my={6}>
        <FormLabel>Static Routing Next Hop</FormLabel>
        <Input
          variant="filled"
          name="static-routing-next-hop"
          value={staticProtocol ? unwrap(staticProtocol.static)[0].nextHop : ''}
          onChange={(event) => {
            const { value } = event.target;
            const [oldStaticRoutingProtocol] = unwrap(staticProtocol.static);
            const newStaticProtocol: RoutingProtocol = {
              type: 'static',
              static: [
                {
                  ...oldStaticRoutingProtocol,
                  nextHop: value,
                },
              ],
            };
            const newProtocols = [bgpProtocol, newStaticProtocol];
            onRoutingProtocolsChange(newProtocols);
          }}
        />
      </FormControl>

      <FormControl id="bgp-autonomous-system" my={6}>
        <FormLabel>Bgp Autonomous System</FormLabel>
        <Input
          variant="filled"
          name="bgp-autonomous-system"
          value={bgpProtocol ? unwrap(bgpProtocol.bgp).autonomousSystem : ''}
          onChange={(event) => {
            const value = Number(event.target.value);

            if (Number.isNaN(value)) {
              return;
            }

            const oldBgpRoutingProtocol = unwrap(bgpProtocol.bgp);
            const newBgpRoutingProtocol: RoutingProtocol = {
              type: 'bgp',
              bgp: {
                ...oldBgpRoutingProtocol,
                autonomousSystem: Number(value),
              },
            };
            const newProtocols = [newBgpRoutingProtocol, staticProtocol];
            onRoutingProtocolsChange(newProtocols);
          }}
        />
      </FormControl>

      <FormControl id="bgp-profile" my={6}>
        <FormLabel>Bgp Profile</FormLabel>
        <Autocomplete2
          items={bgpProfileItems}
          selectedItem={selectedBgpProfileItem}
          onChange={handleBgpProfileChange}
        />
      </FormControl>

      {/* INFO: removed on gamma request */}
      {/* <FormControl id="routing-protocol-vrrp" my={6}>
        <FormLabel>Vrrp</FormLabel>
        <Select
          variant="filled"
          name="routing-protocol-vrrp"
          value={networkAccessState.routingProtocols[0].vrrp}
          onChange={(event) => {
            // eslint-disable-next-line no-console
            setNetworkAccessState({
              ...networkAccessState,
              routingProtocols: [{ ...networkAccessState.routingProtocols[0], vrrp: event.target.value as 'ipv4' }],
            });
          }}
        >
          <option value="vrrp">ipv4</option>
        </Select>
      </FormControl> */}
    </>
  );
};

export default RoutingProtocolForm;
