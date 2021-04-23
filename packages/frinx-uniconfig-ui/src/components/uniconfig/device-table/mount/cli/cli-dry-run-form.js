import React from 'react';
import { GridItem } from '@chakra-ui/react';
import FormInput from '../../../../common/form-input';

const DryRunForm = ({ cliAdvForm, setCliAdvForm }) => (
  <GridItem colSpan={4}>
    <FormInput
      label="Dry run journal size"
      value={cliAdvForm['cli-topology:dry-run-journal-size']}
      onChange={(e) => {
        e.persist();
        setCliAdvForm((prev) => ({ ...prev, 'cli-topology:dry-run-journal-size': e.target.value }));
      }}
      description="Creates dry-run mountpoint and defines number of commands in command history for dry-run mountpoint"
    />
  </GridItem>
);

export default DryRunForm;
