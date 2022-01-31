import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, Icon, Input, Text, Tooltip, Divider } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import FeatherIcon from 'feather-icons-react';
import { uniqueId } from 'lodash';
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

type StaticRoutingTypeWithId = StaticRoutingType & { id: string };

function getDefaultStaticRoutingWithId(): StaticRoutingTypeWithId {
  return {
    id: uniqueId(),
    lanTag: '',
    lan: '10.0.0.1/0',
    nextHop: '10.0.0.3',
  };
}

function getStaticRoutingErrors(errors: FormikErrors<SiteNetworkAccess>): FormikErrors<StaticRoutingType>[] | null {
  if (!errors.routingProtocols || errors.routingProtocols.length === 0) {
    return null;
  }

  const routingProtocolsError = errors.routingProtocols as FormikErrors<RoutingProtocol>[];
  if (!routingProtocolsError) {
    return null;
  }

  if (!routingProtocolsError || routingProtocolsError.length === 0) {
    return null;
  }

  const staticRoutingErrors = routingProtocolsError.filter(
    (error) => error !== undefined && error.static !== undefined,
  );

  if (staticRoutingErrors.length === 0) {
    return null;
  }

  return (staticRoutingErrors.pop()?.static as unknown as FormikErrors<StaticRoutingType>[]) || null;
}

function getRowErrors(errors: FormikErrors<StaticRoutingType>[] | null, key: number) {
  if (!errors) {
    return {};
  }

  return errors[key] || {};
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

  const handleStaticRoutingChange = (staticRouting: StaticRoutingTypeWithId) => {
    console.log('change static routing: ', staticRouting); // eslint-disable-line no-console
    const updateIndex = staticProtocol.static?.findIndex((p) => p.id === staticRouting.id);

    if (updateIndex === undefined || updateIndex < 0) {
      return;
    }

    const updatedStaticProtocol = staticProtocol.static ? [...staticProtocol.static] : [];
    updatedStaticProtocol.splice(updateIndex, 1, staticRouting);
    const newStaticProtocol: RoutingProtocol = {
      type: 'static',
      static: updatedStaticProtocol,
    };
    const newProtocols = [bgpProtocol, newStaticProtocol];
    onRoutingProtocolsChange(newProtocols);
  };

  const handleStaticRoutingCreate = () => {
    console.log('create static routing'); // eslint-disable-line no-console
    const oldStatic = staticProtocol.static ? [...staticProtocol.static] : [];
    const staticRouting = getDefaultStaticRoutingWithId();
    const newStaticProtocol: RoutingProtocol = {
      type: 'static',
      static: [...oldStatic, staticRouting],
    };
    const newProtocols = [bgpProtocol, newStaticProtocol];
    onRoutingProtocolsChange(newProtocols);
  };

  const handleStaticRoutingDelete = (routingId: string) => {
    console.log('delete static routing'); // eslint-disable-line no-console
    const newStaticProtocol =
      staticProtocol.static?.filter((p) => {
        return p.id !== routingId;
      }) || [];

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

      <Box py="1" gridColumn="1/5">
        <Tooltip label="Create Static Routing Protocol">
          <Button
            size="sm"
            aria-label="Create Static Routing Protocol"
            colorScheme="blue"
            leftIcon={<Icon as={FeatherIcon} icon="plus" />}
            onClick={handleStaticRoutingCreate}
          >
            <Text paddingTop="1">Create Static Routing</Text>
          </Button>
        </Tooltip>
      </Box>

      {staticProtocol.static?.map((routing, key) => {
        const staticRoutingErrors = getStaticRoutingErrors(errors);
        const rowErrors = getRowErrors(staticRoutingErrors, key);

        return (
          <StaticRoutingForm
            key={routing.id}
            errors={rowErrors}
            staticRouting={routing}
            onStaticRoutingChange={handleStaticRoutingChange}
            onStaticRoutingDelete={handleStaticRoutingDelete}
          />
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
