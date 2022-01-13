import React, { FC } from 'react';
import { Input, Select, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { FormikErrors, FormikValues } from 'formik';
import { Connection, VpnBearer } from './bearer-types';
import { getSelectOptions } from './options.helper';

type Props = {
  connection: Connection;
  errors: FormikErrors<Connection>;
  onChange: (c: Connection) => void;
};

const ConnectionForm: FC<Props> = ({ connection, errors, onChange }) => {
  return (
    <>
      <FormControl my={6}>
        <FormLabel>Encapsulation Type</FormLabel>
        <Select
          name="encapsulation-type"
          value={connection.encapsulationType || ''}
          onChange={(event) => {
            onChange({
              ...connection,
              encapsulationType: event.target.value || null,
            });
          }}
        >
          <option value="">-- choose encapsulation-type</option>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.bearer.encapsulation_type).map((item) => {
            return (
              <option key={`encapsulation-type-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl my={6}>
        <FormLabel>S-VLAN Assignment Type</FormLabel>
        <Select
          name="svlan-assignment-type"
          value={connection.svlanAssignmentType || ''}
          onChange={(event) => {
            onChange({
              ...connection,
              svlanAssignmentType: event.target.value || null,
            });
          }}
        >
          <option value="">-- choose svlan-assignment-type</option>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.bearer['svlan-assignment-type']).map((item) => {
            return (
              <option key={`svlan-assignment-type-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl my={6}>
        <FormLabel>S-VLAN Tag Protocol Identifier</FormLabel>
        <Select
          name="tpid"
          value={connection.tpId || ''}
          onChange={(event) => {
            onChange({
              ...connection,
              tpId: event.target.value || null,
            });
          }}
        >
          <option value="">-- choose s-vlan tag protocol identifier</option>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.bearer.tpid).map((item) => {
            return (
              <option key={`tpid-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl id="connection-mtu" my={6} isInvalid={errors && errors.mtu != undefined}>
        <FormLabel>MTU</FormLabel>
        <Input
          name="connection-mtu"
          value={connection.mtu}
          onChange={(event) => {
            const numeric = Number(event.target.value);
            if (Number.isNaN(numeric)) {
              return;
            }
            onChange({
              ...connection,
              mtu: numeric,
            });
          }}
        />
        {errors && <FormErrorMessage>{errors.mtu}</FormErrorMessage>}
      </FormControl>
    </>
  );
};

export default ConnectionForm;
