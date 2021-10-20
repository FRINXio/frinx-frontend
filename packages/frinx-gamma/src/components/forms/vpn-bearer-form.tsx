import React, { FC, FormEvent, useEffect, useState } from 'react';
import { Divider, Button, Input, Stack, FormControl, FormLabel } from '@chakra-ui/react';
import { VpnSite } from './site-types';
import { VpnBearer } from './bearer-types';

type Props = {
  mode: 'add' | 'edit';
  bearer: VpnBearer;
  onSubmit: (s: VpnBearer) => void;
  onCancel: () => void;
  onSiteChange?: (s: VpnSite) => void;
};

const VpnBearerForm: FC<Props> = ({ bearer, onSubmit, onCancel }) => {
  const [bearerState, setBearerState] = useState(bearer);

  useEffect(() => {
    setBearerState({
      ...bearer,
    });
  }, [bearer]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(bearerState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="neId" my={6}>
        <FormLabel>Ne ID</FormLabel>
        <Input
          variant="filled"
          name="ne-id"
          value={bearerState.neId}
          onChange={(event) => {
            setBearerState({
              ...bearerState,
              neId: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="portId" my={6}>
        <FormLabel>Port ID</FormLabel>
        <Input
          variant="filled"
          name="port-id"
          value={bearerState.portId}
          onChange={(event) => {
            setBearerState({
              ...bearerState,
              portId: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="sp-bearer-reference" my={6}>
        <FormLabel>SP Bearer Reference</FormLabel>
        <Input
          variant="filled"
          name="sp-bearer-reference"
          value={bearerState.spBearerReference}
          onChange={(event) => {
            setBearerState({
              ...bearerState,
              spBearerReference: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl id="description" my={6}>
        <FormLabel>Description</FormLabel>
        <Input
          variant="filled"
          name="description"
          value={bearerState.description || ''}
          onChange={(event) => {
            setBearerState({
              ...bearerState,
              description: event.target.value || null,
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

export default VpnBearerForm;
