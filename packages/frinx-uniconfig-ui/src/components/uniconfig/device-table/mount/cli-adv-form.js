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
  Switch,
} from '@chakra-ui/react';

const CliAdvForm = ({ cliAdvForm, setCliAdvForm }) => {
  const [showSecret, setShowSecret] = useState(false);

  const renderToggles = () => (
    <Grid templateColumns="repeat(12, 1fr)" columnGap={24} rowGap={4} mt={4}>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">Reconcile</FormLabel>
          <Switch
            isChecked={cliAdvForm['node-extension:reconcile']}
            onChange={(e) =>
              setCliAdvForm({
                ...cliAdvForm,
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
            isChecked={cliAdvForm.dryRun}
            onChange={(e) =>
              setCliAdvForm({
                ...cliAdvForm,
                dryRun: e.target.checked,
              })
            }
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">Privileged mode</FormLabel>
          <Switch
            isChecked={cliAdvForm.privilegedMode}
            onChange={(e) =>
              setCliAdvForm({
                ...cliAdvForm,
                privilegedMode: e.target.checked,
              })
            }
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <FormControl display="flex" justifyContent="space-between" alignItems="center">
          <FormLabel mb="0">Lazy connection</FormLabel>
          <Switch
            isChecked={cliAdvForm.lazyConnection}
            onChange={(e) =>
              setCliAdvForm({
                ...cliAdvForm,
                lazyConnection: e.target.checked,
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
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={12}>
        <GridItem colSpan={4}>
          <FormControl>
            <FormLabel>Journal size</FormLabel>
            <Input
              value={cliAdvForm['cli-topology:journal-size']}
              onChange={(e) => setCliAdvForm({ ...cliAdvForm, ['cli-topology:journal-size']: e.target.value })}
              placeholder="Journal size"
            />
            <FormHelperText>Number of commands in command history</FormHelperText>
          </FormControl>
        </GridItem>
        {cliAdvForm.lazyConnection
          ? [
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>Command timeout</FormLabel>
                  <Input
                    value={cliAdvForm['cli-topology:command-timeout']}
                    onChange={(e) => setCliAdvForm({ ...cliAdvForm, ['cli-topology:command-timeout']: e.target.value })}
                    placeholder="Command timeout"
                  />
                  <FormHelperText>Maximal time (in seconds) for command execution</FormHelperText>
                </FormControl>
              </GridItem>,
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>Connection lazy timeout</FormLabel>
                  <Input
                    value={cliAdvForm['cli-topology:connection-lazy-timeout']}
                    onChange={(e) =>
                      setCliAdvForm({ ...cliAdvForm, ['cli-topology:connection-lazy-timeout']: e.target.value })
                    }
                    placeholder="Connection lazy timeout"
                  />
                  <FormHelperText>Maximal time (in seconds) for connection to keep alive</FormHelperText>
                </FormControl>
              </GridItem>,
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>Connection establish timeout</FormLabel>
                  <Input
                    value={cliAdvForm['cli-topology:connection-establish-timeout']}
                    onChange={(e) =>
                      setCliAdvForm({
                        ...cliAdvForm,
                        ['cli-topology:connection-establish-timeout']: e.target.value,
                      })
                    }
                    placeholder="Connection establish timeout"
                  />
                  <FormHelperText>Maximal time (in seconds) for connection establishment</FormHelperText>
                </FormControl>
              </GridItem>,
            ]
          : [
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>Keepalive delay</FormLabel>
                  <Input
                    value={cliAdvForm['cli-topology:keepalive-delay']}
                    onChange={(e) => setCliAdvForm({ ...cliAdvForm, ['cli-topology:keepalive-delay']: e.target.value })}
                    placeholder="Keepalive delay"
                  />
                  <FormHelperText>
                    Delay (in seconds) between sending of keepalive messages over CLI session
                  </FormHelperText>
                </FormControl>
              </GridItem>,
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>Keepalive timeout</FormLabel>
                  <Input
                    value={cliAdvForm['cli-topology:keepalive-timeout']}
                    onChange={(e) =>
                      setCliAdvForm({ ...cliAdvForm, ['cli-topology:keepalive-timeout']: e.target.value })
                    }
                    placeholder="Keepalive timeout"
                  />
                  <FormHelperText>
                    Close connection if keepalive response is not received within specified seconds
                  </FormHelperText>
                </FormControl>
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
                  onChange={(e) => setCliAdvForm({ ...cliAdvForm, ['cli-topology:secret']: e.target.value })}
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
            <FormControl>
              <FormLabel>Dry run journal size</FormLabel>
              <Input
                value={cliAdvForm['cli-topology:dry-run-journal-size']}
                onChange={(e) =>
                  setCliAdvForm({ ...cliAdvForm, ['cli-topology:dry-run-journal-size']: e.target.value })
                }
                placeholder="Dry run journal size"
              />
              <FormHelperText>
                Creates dry-run mountpoint and defines number of commands in command history for dry-run mountpoint
              </FormHelperText>
            </FormControl>
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default CliAdvForm;
