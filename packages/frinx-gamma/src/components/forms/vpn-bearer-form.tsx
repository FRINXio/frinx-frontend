import React, { FC, FormEvent, useEffect, useState } from 'react';
import { Divider, Button, Input, Stack, FormControl, FormLabel } from '@chakra-ui/react';
import { VpnSite } from './site-types';
import { VpnBearer, VpnCarrier, VpnNode } from './bearer-types';
import CarrierForm from './carrier-form';
import ConnectionForm from './connection-form';
import Autocomplete2 from '../autocomplete-2/autocomplete-2';

type Props = {
  mode: 'add' | 'edit';
  nodes: VpnNode[];
  carriers: VpnCarrier[];
  bearer: VpnBearer;
  onSubmit: (s: VpnBearer) => void;
  onCancel: () => void;
  onSiteChange?: (s: VpnSite) => void;
};

const VpnBearerForm: FC<Props> = ({ mode, nodes, carriers, bearer, onSubmit, onCancel }) => {
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

  const nodeItems = nodes.map((n) => ({
    value: n.neId,
    label: `${n.neId} (${n.routerId})`,
  }));
  const [selectedNode] = nodeItems.filter((n) => {
    return n.value === bearerState.neId;
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="ne-id" my={6}>
        <FormLabel>Ne Id</FormLabel>
        <Autocomplete2
          items={nodeItems}
          selectedItem={selectedNode}
          onChange={(item) => {
            setBearerState({
              ...bearerState,
              neId: item ? item.value : '',
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
          disabled={mode === 'edit'}
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

      <CarrierForm
        carriers={carriers}
        carrier={
          bearerState.carrier || { carrierName: null, carrierReference: null, serviceType: null, serviceStatus: null }
        }
        onChange={(carrier) => {
          setBearerState({
            ...bearerState,
            carrier,
          });
        }}
      />
      <ConnectionForm
        connection={
          bearerState.connection || {
            tpId: null,
            svlanAssignmentType: null,
            encapsulationType: null,
            mtu: 0,
            remoteNeId: null,
            remotePortId: null,
          }
        }
        onChange={(connection) => {
          setBearerState({
            ...bearerState,
            connection,
          });
        }}
      />

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
