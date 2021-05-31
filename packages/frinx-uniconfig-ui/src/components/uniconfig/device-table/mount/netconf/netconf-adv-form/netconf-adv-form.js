import React from 'react';
import { Box, Flex, FormControl, FormHelperText, FormLabel, Grid, GridItem, Switch, Textarea } from '@chakra-ui/react';
import NetconfAdvFormToggles from './netconf-adv-form-toggles';
import FormInput from '../../../../../common/form-input';
import NetconfDryRunForm from './netconf-dry-run-from';
import NetconfCapabilitiesForm from './netconf-capabilities-form';

const NetconfAdvForm = ({ netconfAdvForm, setNetconfAdvForm, setBlacklistEnabled, isBlacklistEnabled }) => {
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
      <Box marginTop={6}>
        <FormControl>
          <Flex>
            <FormLabel>Blacklist</FormLabel>
            <Switch
              isChecked={isBlacklistEnabled}
              onChange={(e) => {
                e.persist();
                setBlacklistEnabled(e.target.checked);
              }}
            />
          </Flex>
          <Textarea
            isDisabled={!isBlacklistEnabled}
            value={netconfAdvForm['uniconfig-config:blacklist']['uniconfig-config:path'].join()}
            onChange={(e) => {
              e.persist();
              setNetconfAdvForm((prev) => ({
                ...prev,
                'uniconfig-config:blacklist': {
                  ...prev['uniconfig-config:blacklist'],
                  'uniconfig-config:path': e.target.value.split(','),
                },
              }));
            }}
          />
          <FormHelperText>List of blacklisted root paths that should not be read from the device</FormHelperText>
        </FormControl>
      </Box>
    </>
  );
};

export default NetconfAdvForm;
