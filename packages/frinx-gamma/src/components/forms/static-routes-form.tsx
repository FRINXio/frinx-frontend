import React, { VoidFunctionComponent } from 'react';
import { Box, FormControl, FormLabel, FormErrorMessage, Icon, IconButton, Input, Tooltip } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import FeatherIcon from 'feather-icons-react';
import { StaticRoutingType } from './site-types';

type StaticRoutingTypeWithId = StaticRoutingType & { id: string };

export type StaticRoutingProtocol = {
  type: 'static';
  static: StaticRoutingTypeWithId;
};

type Props = {
  errors: FormikErrors<StaticRoutingType>;
  staticRouting: StaticRoutingTypeWithId;
  onStaticRoutingChange: (staticRouting: StaticRoutingTypeWithId) => void;
  onStaticRoutingDelete: (staticRoutingId: string) => void;
};

const StaticRoutesForm: VoidFunctionComponent<Props> = ({
  errors,
  staticRouting,
  onStaticRoutingChange,
  onStaticRoutingDelete,
}) => {
  return (
    <>
      <FormControl id="static-routing-lan" my={1}>
        <FormLabel>Static Routing LAN</FormLabel>
        <Input
          name="static-routing-lan"
          value={staticRouting.lan || ''}
          onChange={(event) => {
            const { value } = event.target;
            const newStaticProtocol = {
              ...staticRouting,
              lan: value,
            };
            onStaticRoutingChange(newStaticProtocol);
          }}
        />
      </FormControl>

      <FormControl id="static-routing-next-hop" my={1}>
        <FormLabel>Static Routing Next Hop</FormLabel>
        <Input
          name="static-routing-next-hop"
          value={staticRouting.nextHop || ''}
          onChange={(event) => {
            const { value } = event.target;
            const newStaticProtocol = {
              ...staticRouting,
              nextHop: value,
            };
            onStaticRoutingChange(newStaticProtocol);
          }}
        />
      </FormControl>

      <FormControl id="static-routing-lan-tag" my={1} isInvalid={errors.lanTag != null}>
        <FormLabel>Static Routing Lan Tag</FormLabel>
        <Input
          name="static-routing-lan-tag"
          value={staticRouting.lanTag || ''}
          onChange={(event) => {
            const { value } = event.target;
            const newStaticProtocol = {
              ...staticRouting,
              lanTag: value || null,
            };
            onStaticRoutingChange(newStaticProtocol);
          }}
        />
        {errors.lanTag != null && <FormErrorMessage>Lan Tag must be value between 0-65535</FormErrorMessage>}
      </FormControl>
      <Box alignItems="end">
        <Tooltip label="Delete Static Routing Protocol">
          <IconButton
            marginTop={9}
            aria-label="Delete Static Routing Protocol"
            colorScheme="red"
            icon={<Icon as={FeatherIcon} icon="trash-2" />}
            onClick={() => onStaticRoutingDelete(staticRouting.id)}
          />
        </Tooltip>
      </Box>
    </>
  );
};

export default StaticRoutesForm;
