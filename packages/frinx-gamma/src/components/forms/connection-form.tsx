import React, { FC } from 'react';
import { Input, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import { Connection, VpnBearer } from './bearer-types';
import { getSelectOptions } from './options.helper';

type Props = {
  connection: Connection;
  errors: FormikErrors<VpnBearer>;
  onChange: (c: Connection) => void;
};

const ConnectionForm: FC<Props> = ({ connection, onChange }) => {
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
        <FormLabel>Svlan Assignment Type</FormLabel>
        <Select
          name="svlan-assignment-type"
          value={connection.svlanAssignmentType || 'auto'}
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
        <FormLabel>Tpid</FormLabel>
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
          <option value="">-- choose tpId</option>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.bearer.tpid).map((item) => {
            return (
              <option key={`tpid-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl id="connection-mtu" my={6}>
        <FormLabel>Mtu</FormLabel>
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
      </FormControl>
    </>
  );
};

export default ConnectionForm;
