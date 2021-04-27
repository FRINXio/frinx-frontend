import React from 'react';
import { GridItem } from '@chakra-ui/react';
import FormInput from '../../../../../common/form-input';

const NetconfDryRunForm = ({ netconfAdvForm, setNetconfAdvForm }) => (
  <GridItem colSpan={4}>
    <FormInput
      label="Dry run journal size"
      value={netconfAdvForm['netconf-node-topology:dry-run-journal-size']}
      onChange={(e) => {
        e.persist();
        setNetconfAdvForm((prev) => ({
          ...prev,
          'netconf-node-topology:dry-run-journal-size': e.target.value,
        }));
      }}
      description="Creates dry-run mountpoint and defines number of commands in command history for dry-run mountpoint"
    />
  </GridItem>
);

export default NetconfDryRunForm;
