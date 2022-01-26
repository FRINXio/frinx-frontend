import React, { VoidFunctionComponent } from 'react';
import { Box, FormControl, FormLabel, IconButton, Icon, Input, Text, Tooltip, Divider } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import FeatherIcon from 'feather-icons-react';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { RoutingProtocol, RoutingProtocolType, StaticRoutingType } from './site-types';
import unwrap from '../../helpers/unwrap';
import { SiteNetworkAccess } from '../../network-types';
import StaticRoutingForm from './static-routes-form';

type Props = {
  errors: FormikErrors<SiteNetworkAccess>;
  staticProtocol: RoutingProtocol;
  bgpProtocol: RoutingProtocol;
  bgpProfileItems: Item[];
  selectedBgpProfileItem: Item;
  onRoutingProtocolsChange: (routingProtcols: RoutingProtocol[]) => void;
};

function getDefaultStaticRouting(): StaticRoutingType {
  return {
    lanTag: '',
    lan: '10.0.0.1/0',
    nextHop: '10.0.0.3',
  };
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

  const handleStaticRoutingChange = (staticRouting: StaticRoutingType) => {
    console.log('change static routing: ', staticRouting); // eslint-disable-line no-console

    const newStaticProtocol: RoutingProtocol = {
      type: 'static',
      static: [staticRouting],
    };
    const newProtocols = [bgpProtocol, newStaticProtocol];
    onRoutingProtocolsChange(newProtocols);
  };

  const handleStaticRoutingCreate = (staticRouting: StaticRoutingType) => {
    console.log('create static routing'); // eslint-disable-line no-console
    const oldStatic = staticProtocol.static ? [...staticProtocol.static] : [];
    const newStaticProtocol: RoutingProtocol = {
      type: 'static',
      static: [...oldStatic, staticRouting],
    };
    const newProtocols = [bgpProtocol, newStaticProtocol];
    onRoutingProtocolsChange(newProtocols);
  };

  const handleStaticRoutingDelete = (staticRouting: StaticRoutingType) => {
    console.log('delete static routing'); // eslint-disable-line no-console
    const newStaticProtocol = staticProtocol.static?.filter((p) => {
      return p.lan !== staticRouting.lan && p.nextHop !== staticRouting.nextHop;
    });

    const newProtocols = newStaticProtocol
      ? [
          bgpProtocol,
          {
            type: 'static' as RoutingProtocolType,
            static: newStaticProtocol,
          },
        ]
      : [bgpProtocol];

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

      <StaticRoutingForm
        errors={errors}
        staticRouting={getDefaultStaticRouting()}
        onStaticRoutingChange={handleStaticRoutingChange}
        onStaticRoutingCreate={handleStaticRoutingCreate}
      />
      {staticProtocol.static?.map((routing) => {
        return (
          // <HStack spacing={4} gridColumn="1/5" key={`${routing.lan}-${routing.nextHop}`}>
          <React.Fragment key={`${routing.lan}-${routing.nextHop}`}>
            <Text p={4}>{routing.lan}</Text>
            <Text p={4}>{routing.nextHop}</Text>
            <Text p={4}>{routing.lanTag}</Text>
            <Box py={4}>
              <Tooltip label="Delete Static Routing Protocol">
                <IconButton
                  aria-label="Delete Static Routing Protocol"
                  colorScheme="red"
                  icon={<Icon as={FeatherIcon} icon="trash-2" />}
                  size="md"
                  onClick={() => handleStaticRoutingDelete(routing)}
                />
              </Tooltip>
            </Box>
          </React.Fragment>
        );
      })}

      <Divider gridColumn="1/5" my={2} />

      <FormControl id="bgp-autonomous-system" my={1}>
        <FormLabel>CPE Bgp Autonomous System</FormLabel>
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

      <FormControl id="bgp-profile" my={1}>
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
