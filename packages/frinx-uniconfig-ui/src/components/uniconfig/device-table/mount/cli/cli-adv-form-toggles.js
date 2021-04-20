import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import FormSwitch from '../../../../common/form-switch';

const CliAdvFormToggles = ({ cliAdvForm, setCliAdvForm }) => (
  <Grid templateColumns="repeat(12, 1fr)" columnGap={24} rowGap={4} mt={4}>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Reconcile"
        isChecked={cliAdvForm['node-extension:reconcile']}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({
            ...prev,
            'node-extension:reconcile': e.target.checked,
          }));
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Dry run"
        isChecked={cliAdvForm.dryRun}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({
            ...prev,
            dryRun: e.target.checked,
          }));
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Privileged mode"
        isChecked={cliAdvForm.privilegedMode}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({
            ...prev,
            privilegedMode: e.target.checked,
          }));
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Lazy connection"
        isChecked={cliAdvForm.lazyConnection}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({
            ...prev,
            lazyConnection: e.target.checked,
          }));
        }}
      />
    </GridItem>
  </Grid>
);

export default CliAdvFormToggles;
