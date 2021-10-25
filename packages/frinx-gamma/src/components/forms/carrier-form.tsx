import React, { FC } from 'react';
import { Input, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { Carrier } from './bearer-types';

type Props = {
  carrier: Carrier;
  onChange: (c: Carrier) => void;
};

const CarrierForm: FC<Props> = ({ carrier, onChange }) => {
  return (
    <>
      <FormControl id="carrier-name" my={6}>
        <FormLabel>Carrier Name</FormLabel>
        <Input
          variant="filled"
          name="carrier-name"
          value={carrier.carrierName || ''}
          onChange={(event) => {
            onChange({
              ...carrier,
              carrierName: event.target.value || null,
            });
          }}
        />
      </FormControl>
      <FormControl id="carrier-reference" my={6}>
        <FormLabel>Carrier Reference</FormLabel>
        <Input
          variant="filled"
          name="carrier-reference"
          value={carrier.carrierReference || ''}
          onChange={(event) => {
            onChange({
              ...carrier,
              carrierReference: event.target.value || null,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Service Type</FormLabel>
        <Select
          variant="filled"
          name="service-type"
          value={carrier.serviceType || ''}
          onChange={(event) => {
            onChange({
              ...carrier,
              serviceType: event.target.value || null,
            });
          }}
        >
          <option value="">-- choose service type</option>
          <option value="evc">evc</option>
          <option value="shared-fw">shared-fw</option>
        </Select>
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Service Status</FormLabel>
        <Select
          variant="filled"
          name="service-status"
          value={carrier.serviceStatus || ''}
          onChange={(event) => {
            onChange({
              ...carrier,
              serviceStatus: event.target.value || null,
            });
          }}
        >
          <option value="">-- choose service status</option>
          <option value="active">active</option>
          <option value="ordered">ordered</option>
          <option value="reserved">reserved</option>
          <option value="no-more-capacity">no-more-capacity</option>
          <option value="disabled">disabled</option>
        </Select>
      </FormControl>
    </>
  );
};

export default CarrierForm;
