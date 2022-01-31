import React, { VoidFunctionComponent } from 'react';
import { FormControl, FormLabel, FormErrorMessage, Input } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { RoutingProtocol, SiteNetworkAccess } from './site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  errors: FormikErrors<SiteNetworkAccess>;
  staticProtocol: RoutingProtocol;
  bgpProtocol: RoutingProtocol;
  bgpProfileItems: Item[];
  selectedBgpProfileItem: Item;
  onRoutingProtocolsChange: (routingProtcols: RoutingProtocol[]) => void;
};

// TODO: can we write it more simple???
function getLanTagErrorMessage(errors: FormikErrors<SiteNetworkAccess>): string | null {
  if (!errors.routingProtocols || errors.routingProtocols.length === 0) {
    return null;
  }

  const routingProtocolsError = errors.routingProtocols as FormikErrors<RoutingProtocol>[];
  const staticRoutingProtocolsError = routingProtocolsError.filter((e) => e.static).pop();
  if (staticRoutingProtocolsError) {
    const staticErrors = staticRoutingProtocolsError.static as unknown as [{ lanTag?: string }];
    return staticErrors[0].lanTag || null;
  }

  return null;
}

const RoutingProtocolForm: VoidFunctionComponent<Props> = ({
  errors,
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

  const lanTagErrorMessage = getLanTagErrorMessage(errors);

  return (
    <>
      {/* INFO: removed on gamma request
          should be automatically recognized based on bgp and static inputs
      */}
      {/* <FormControl id="routing-protocol-type" my={6}>
        <FormLabel>Routing Protocol Type</FormLabel>{' '}
        <Select
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

      <FormControl id="static-routing-lan-tag" my={6} isInvalid={lanTagErrorMessage !== null}>
        <FormLabel>Static Routing Lan Tag</FormLabel>
        <Input
          name="static-routing-lan-tag"
          value={staticProtocol.static && staticProtocol.static[0].lanTag ? staticProtocol.static[0].lanTag : ''}
          onChange={(event) => {
            const { value } = event.target;
            const [oldStaticRoutingProtocol] = unwrap(staticProtocol.static);
            const newStaticProtocol: RoutingProtocol = {
              type: 'static',
              static: [
                {
                  ...oldStaticRoutingProtocol,
                  lanTag: value || null,
                },
              ],
            };
            const newProtocols = [bgpProtocol, newStaticProtocol];
            onRoutingProtocolsChange(newProtocols);
          }}
        />
        {lanTagErrorMessage && <FormErrorMessage>Lan Tag must be value between 0-65535</FormErrorMessage>}
      </FormControl>

      <FormControl id="bgp-autonomous-system" my={6}>
        <FormLabel>Bgp Autonomous System</FormLabel>
        <Input
          name="bgp-autonomous-system"
          value={bgpProtocol.bgp ? bgpProtocol.bgp.autonomousSystem : ''}
          onChange={(event) => {
            const { value } = event.target;
            if (Number.isNaN(Number(value))) {
              return;
            }

            const oldBgpRoutingProtocol = unwrap(bgpProtocol.bgp);
            const newBgpRoutingProtocol: RoutingProtocol = {
              type: 'bgp',
              bgp: {
                ...oldBgpRoutingProtocol,
                autonomousSystem: value,
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
