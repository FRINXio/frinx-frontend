import React, { useState, VoidFunctionComponent } from 'react';
import { Box, FormControl, FormLabel, FormErrorMessage, Icon, IconButton, Input, Tooltip } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import FeatherIcon from 'feather-icons-react';
import { RoutingProtocol, StaticRoutingType } from './site-types';
import { SiteNetworkAccess } from '../../network-types';

export type StaticRoutingProtocol = {
  static: StaticRoutingType;
};

type Props = {
  errors: FormikErrors<SiteNetworkAccess>;
  staticRouting: StaticRoutingType;
  onStaticRoutingChange: (staticRouting: StaticRoutingType) => void;
  onStaticRoutingCreate: (staticRouting: StaticRoutingType) => void;
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

const StaticRoutesForm: VoidFunctionComponent<Props> = ({ errors, staticRouting, onStaticRoutingCreate }) => {
  const [routing, setRouting] = useState<StaticRoutingType>(staticRouting);
  const lanTagErrorMessage = getLanTagErrorMessage(errors);

  const handleStaticRoutingCreate = () => {
    onStaticRoutingCreate(routing);
    setRouting(staticRouting);
  };

  return (
    <>
      <FormControl id="static-routing-lan" my={1}>
        <FormLabel>Static Routing LAN</FormLabel>
        <Input
          name="static-routing-lan"
          value={routing.lan || ''}
          onChange={(event) => {
            const { value } = event.target;
            const newStaticProtocol = {
              ...routing,
              lan: value,
            };
            setRouting(newStaticProtocol);
          }}
        />
      </FormControl>

      <FormControl id="static-routing-next-hop" my={1}>
        <FormLabel>Static Routing Next Hop</FormLabel>
        <Input
          name="static-routing-next-hop"
          value={routing.nextHop || ''}
          onChange={(event) => {
            const { value } = event.target;
            const newStaticProtocol = {
              ...routing,
              nextHop: value,
            };
            setRouting(newStaticProtocol);
          }}
        />
      </FormControl>

      <FormControl id="static-routing-lan-tag" my={1} isInvalid={lanTagErrorMessage !== null}>
        <FormLabel>Static Routing Lan Tag</FormLabel>
        <Input
          name="static-routing-lan-tag"
          value={routing.lanTag || ''}
          onChange={(event) => {
            const { value } = event.target;
            const newStaticProtocol = {
              ...routing,
              lanTag: value || null,
            };
            setRouting(newStaticProtocol);
          }}
        />
        {lanTagErrorMessage && <FormErrorMessage>Lan Tag must be value between 0-65535</FormErrorMessage>}
      </FormControl>
      <Box alignItems="end">
        <Tooltip label="Create Static Routing Protocol">
          <IconButton
            marginTop={9}
            aria-label="Create Static Routing Protocol"
            colorScheme="blue"
            icon={<Icon as={FeatherIcon} icon="plus" />}
            onClick={handleStaticRoutingCreate}
            isDisabled={lanTagErrorMessage != null}
          />
        </Tooltip>
      </Box>
    </>
  );
};

export default StaticRoutesForm;
