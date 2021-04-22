import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  FormHelperText,
  Textarea,
} from '@chakra-ui/react';
import NetconfAdvFormToggles from './netconf-adv-form-toggles';

const NetconfAdvForm = ({ netconfAdvForm, setNetconfAdvForm }) => {
  return (
    <>
      <NetconfAdvFormToggles netconfAdvForm={netconfAdvForm} setNetconfAdvForm={setNetconfAdvForm} />
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
        <GridItem colSpan={4}>
          <FormControl>
            <FormLabel>Keepalive delay</FormLabel>
            <Input
              value={netconfAdvForm['netconf-node-topology:keepalive-delay']}
              onChange={(e) =>
                setNetconfAdvForm({ ...netconfAdvForm, 'netconf-node-topology:keepalive-delay': e.target.value })
              }
              placeholder="Keepalive delay"
            />
            <FormHelperText>Delay (in seconds) between sending of keepalive messages over CLI session</FormHelperText>
          </FormControl>
        </GridItem>
        {netconfAdvForm.dryRun && (
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel>Dry run journal size</FormLabel>
              <Input
                value={netconfAdvForm['netconf-node-topology:dry-run-journal-size']}
                onChange={(e) =>
                  setNetconfAdvForm({
                    ...netconfAdvForm,
                    'netconf-node-topology:dry-run-journal-size': e.target.value,
                  })
                }
                placeholder="Dry run journal size"
              />
              <FormHelperText>Username credential</FormHelperText>
            </FormControl>
          </GridItem>
        )}
        {netconfAdvForm['netconf-node-topology:override'] && (
          <GridItem colSpan={12}>
            <FormControl>
              <FormLabel>Capabilities</FormLabel>
              <Textarea
                value={netconfAdvForm['netconf-node-topology:yang-module-capabilities']}
                onChange={(e) =>
                  setNetconfAdvForm({
                    ...netconfAdvForm,
                    'netconf-node-topology:yang-module-capabilities': e.target.value,
                  })
                }
                placeholder="Capabilities"
              />

              <FormHelperText>Password credential</FormHelperText>
            </FormControl>
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default NetconfAdvForm;
