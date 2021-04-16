import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  FormHelperText,
  Switch,
  Textarea,
} from '@chakra-ui/react';

const NetconfAdvForm = ({ netconfAdvForm, setNetconfAdvForm }) => {
  const renderToggles = () => (
    <Grid templateColumns="repeat(12, 1fr)" columnGap={24} rowGap={4} mt={4}>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">Reconcile</FormLabel>
          <Switch
            isChecked={netconfAdvForm['node-extension:reconcile']}
            onChange={(e) =>
              setNetconfAdvForm({
                ...netconfAdvForm,
                ['node-extension:reconcile']: e.target.checked,
              })
            }
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">Dry run</FormLabel>
          <Switch
            isChecked={netconfAdvForm.dryRun}
            onChange={(e) =>
              setNetconfAdvForm({
                ...netconfAdvForm,
                dryRun: e.target.checked,
              })
            }
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">TCP Only</FormLabel>
          <Switch
            isChecked={netconfAdvForm['netconf-node-topology:tcp-only']}
            onChange={(e) =>
              setNetconfAdvForm({
                ...netconfAdvForm,
                ['netconf-node-topology:tcp-only']: e.target.checked,
              })
            }
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">Override capabilities</FormLabel>
          <Switch
            isChecked={netconfAdvForm['netconf-node-topology:override']}
            onChange={(e) =>
              setNetconfAdvForm({
                ...netconfAdvForm,
                ['netconf-node-topology:override']: e.target.checked,
              })
            }
          />
        </FormControl>
      </GridItem>
    </Grid>
  );

  return (
    <>
      {renderToggles()}
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
        <GridItem colSpan={4}>
          <FormControl>
            <FormLabel>Keepalive delay</FormLabel>
            <Input
              value={netconfAdvForm['netconf-node-topology:keepalive-delay']}
              onChange={(e) =>
                setNetconfAdvForm({ ...netconfAdvForm, ['netconf-node-topology:keepalive-delay']: e.target.value })
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
                    ['netconf-node-topology:dry-run-journal-size']: e.target.value,
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
                    ['netconf-node-topology:yang-module-capabilities']: e.target.value,
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
