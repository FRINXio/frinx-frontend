import React, { FC } from 'react';
import { Input, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { Connection } from './bearer-types';

type Props = {
  connection: Connection;
  onChange: (c: Connection) => void;
};

const ConnectionForm: FC<Props> = ({ connection, onChange }) => {
  return (
    <>
      <FormControl my={6}>
        <FormLabel>Encapsulation Type</FormLabel>
        <Select
          variant="filled"
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
          <option value="tagged-int">tagged-in</option>
          <option value="untagged-int">untagged-in</option>
        </Select>
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Svlan Assignment Type</FormLabel>
        <Select
          variant="filled"
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
          <option value="auto">auto</option>
          <option value="third-party">third-party</option>
        </Select>
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Tpid</FormLabel>
        <Select
          variant="filled"
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
          <option value="dot1ad">dot1ad</option>
          <option value="qinq">qinq</option>
        </Select>
      </FormControl>
      <FormControl id="connection-mtu" my={6}>
        <FormLabel>Mtu</FormLabel>
        <Input
          variant="filled"
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
