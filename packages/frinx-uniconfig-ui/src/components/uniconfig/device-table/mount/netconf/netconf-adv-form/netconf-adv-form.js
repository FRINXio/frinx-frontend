import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import NetconfAdvFormToggles from './netconf-adv-form-toggles';
import FormInput from '../../../../../common/form-input';
import NetconfDryRunForm from './netconf-dry-run-from';
import NetconfCapabilitiesForm from './netconf-capabilities-form';

const NetconfAdvForm = ({ netconfAdvForm, setNetconfAdvForm }) => {
  return (
    <>
      <NetconfAdvFormToggles netconfAdvForm={netconfAdvForm} setNetconfAdvForm={setNetconfAdvForm} />
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
        <GridItem colSpan={4}>
          <FormInput
            label="Keepalive delay"
            value={netconfAdvForm['netconf-node-topology:keepalive-delay']}
            onChange={(e) => {
              e.persist();
              setNetconfAdvForm((prev) => ({ ...prev, 'netconf-node-topology:keepalive-delay': e.target.value }));
            }}
            description="Delay (in seconds) between sending of keepalive messages over CLI session"
          />
        </GridItem>
        {netconfAdvForm.hasDryRun && (
          <NetconfDryRunForm netconfAdvForm={netconfAdvForm} setNetconfAdvForm={setNetconfAdvForm} />
        )}
        {netconfAdvForm['netconf-node-topology:override'] && (
          <NetconfCapabilitiesForm netconfAdvForm={netconfAdvForm} setNetconfAdvForm={setNetconfAdvForm} />
        )}
      </Grid>
    </>
  );
};

export default NetconfAdvForm;
