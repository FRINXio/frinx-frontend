import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import FormInput from '../../../../common/form-input';
import CliAdvFormToggles from './cli-adv-form-toggles';
import CliKeepaliveForm from './cli-keepalive-form';
import CliLazyConnectionForm from './cli-lazy-connection-form';
import CliPrivilegedModeForm from './cli-privileged-mode-form';
import CliDryRunForm from './cli-dry-run-form';

const CliAdvForm = ({ cliAdvForm, setCliAdvForm }) => {
  return (
    <>
      <CliAdvFormToggles cliAdvForm={cliAdvForm} setCliAdvForm={setCliAdvForm} />
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={12}>
        <GridItem colSpan={4}>
          <FormInput
            label="Journal size"
            value={cliAdvForm['cli-topology:journal-size']}
            onChange={(e) => {
              e.persist();
              setCliAdvForm((prev) => ({ ...prev, 'cli-topology:journal-size': e.target.value }));
            }}
            description="Number of commands in command history"
          />
        </GridItem>
        {cliAdvForm.hasLazyConnection ? (
          <CliLazyConnectionForm setCliAdvForm={setCliAdvForm} cliAdvForm={cliAdvForm} />
        ) : (
          <CliKeepaliveForm setCliAdvForm={setCliAdvForm} cliAdvForm={cliAdvForm} />
        )}
        {cliAdvForm.hasPrivilegedMode && <CliPrivilegedModeForm setCliAdvForm={setCliAdvForm} cliAdvForm={cliAdvForm} />}
        {cliAdvForm.hasDryRun && <CliDryRunForm setCliAdvForm={setCliAdvForm} cliAdvForm={cliAdvForm} />}
      </Grid>
    </>
  );
};

export default CliAdvForm;
