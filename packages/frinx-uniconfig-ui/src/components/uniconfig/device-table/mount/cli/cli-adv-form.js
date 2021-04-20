import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  FormHelperText,
} from '@chakra-ui/react';
import FormInput from '../../../../common/form-input';
import CliAdvFormToggles from './cli-adv-form-toggles';

const CliAdvForm = ({ cliAdvForm, setCliAdvForm }) => {
  const [showSecret, setShowSecret] = useState(false);

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
        {cliAdvForm.lazyConnection
          ? [
              <GridItem key="cli-topology:command-timeout" colSpan={4}>
                <FormInput
                  label="Command timeout"
                  value={cliAdvForm['cli-topology:command-timeout']}
                  onChange={(e) => {
                    e.persist();
                    setCliAdvForm((prev) => ({ ...prev, 'cli-topology:command-timeout': e.target.value }));
                  }}
                  description="Maximal time (in seconds) for command execution"
                />
              </GridItem>,
              <GridItem key="cli-topology:connection-lazy-timeout" colSpan={4}>
                <FormInput
                  label="Connection lazy timeout"
                  value={cliAdvForm['cli-topology:connection-lazy-timeout']}
                  onChange={(e) => {
                    e.persist();
                    setCliAdvForm((prev) => ({ ...prev, 'cli-topology:connection-lazy-timeout': e.target.value }));
                  }}
                  description="Maximal time (in seconds) for connection to keep alive"
                />
              </GridItem>,
              <GridItem key="cli-topology:connection-establish-timeout" colSpan={4}>
                <FormInput
                  label="Connection establish timeout"
                  value={cliAdvForm['cli-topology:connection-establish-timeout']}
                  onChange={(e) => {
                    e.persist();
                    setCliAdvForm((prev) => ({ ...prev, 'cli-topology:connection-establish-timeout': e.target.value }));
                  }}
                  description="Maximal time (in seconds) for connection establishment"
                />
              </GridItem>,
            ]
          : [
              <GridItem key="cli-topology:keepalive-delay" colSpan={4}>
                <FormInput
                  label="Keepalive delay"
                  value={cliAdvForm['cli-topology:keepalive-delay']}
                  onChange={(e) => {
                    e.persist();
                    setCliAdvForm((prev) => ({ ...prev, 'cli-topology:keepalive-delay': e.target.value }));
                  }}
                  description="Delay (in seconds) between sending of keepalive messages over CLI session"
                />
              </GridItem>,
              <GridItem key="cli-topology:keepalive-timeout" colSpan={4}>
                <FormInput
                  label="Keepalive timeout"
                  value={cliAdvForm['cli-topology:keepalive-timeout']}
                  onChange={(e) => {
                    e.persist();
                    setCliAdvForm((prev) => ({ ...prev, 'cli-topology:keepalive-timeout': e.target.value }));
                  }}
                  description="Close connection if keepalive response is not received within specified seconds"
                />
              </GridItem>,
            ]}
        {cliAdvForm.privilegedMode && (
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel>Secret</FormLabel>
              <InputGroup>
                <Input
                  value={cliAdvForm['cli-topology:secret']}
                  type={!showSecret ? 'password' : 'text'}
                  onChange={(e) => {
                    e.persist();
                    setCliAdvForm((prev) => ({ ...prev, 'cli-topology:secret': e.target.value }));
                  }}
                  placeholder="Secret"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowSecret(!showSecret)}>
                    {showSecret ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>Used for entering privileged mode on cisco devices</FormHelperText>
            </FormControl>
          </GridItem>
        )}
        {cliAdvForm.dryRun && (
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
        )}
      </Grid>
    </>
  );
};

export default CliAdvForm;
