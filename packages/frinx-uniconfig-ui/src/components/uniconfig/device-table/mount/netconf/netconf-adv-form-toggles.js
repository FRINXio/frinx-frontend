import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import FormSwitch from '../../../../common/form-switch';

const NetconfAdvFormToggles = ({ netconfAdvForm, setNetconfAdvForm }) => (
  <Grid templateColumns="repeat(12, 1fr)" columnGap={24} rowGap={4} mt={4}>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Reconcile"
        isChecked={netconfAdvForm['node-extension:reconcile']}
        onChange={(e) => {
          e.persist();
          setNetconfAdvForm((prev) => ({
            ...prev,
            'node-extension:reconcile': e.target.checked,
          }));
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Dry run"
        isChecked={netconfAdvForm.dryRun}
        onChange={(e) => {
          e.persist();
          setNetconfAdvForm((prev) => ({
            ...prev,
            dryRun: e.target.checked,
          }));
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <FormSwitch
        label="TCP Only"
        isChecked={netconfAdvForm['netconf-node-topology:tcp-only']}
        onChange={(e) => {
          e.persist();
          setNetconfAdvForm((prev) => ({
            ...prev,
            'netconf-node-topology:tcp-only': e.target.checked,
          }));
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <FormSwitch
        label="Override capabilities"
        isChecked={netconfAdvForm['netconf-node-topology:override']}
        onChange={(e) => {
          e.persist();
          setNetconfAdvForm((prev) => ({
            ...prev,
            'netconf-node-topology:override': e.target.checked,
          }));
        }}
      />
    </GridItem>
  </Grid>
);

export default NetconfAdvFormToggles;
