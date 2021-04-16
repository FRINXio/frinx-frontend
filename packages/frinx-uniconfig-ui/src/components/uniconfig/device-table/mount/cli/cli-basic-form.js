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
  Select,
  FormHelperText,
} from '@chakra-ui/react';

const CliBasicForm = ({ cliBasicForm, setCliBasicForm, supportedDevices, getDeviceTypeVersions }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
      <GridItem colSpan={6}>
        <FormControl>
          <FormLabel>Node ID</FormLabel>
          <Input
            value={cliBasicForm['network-topology:node-id']}
            onChange={(e) => setCliBasicForm({ ...cliBasicForm, ['network-topology:node-id']: e.target.value })}
            placeholder="Node ID"
          />
          <FormHelperText>Unique identifier of device across all systems</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Device type</FormLabel>
          <Select placeholder={cliBasicForm['cli-topology:device-type']}>
            {Object.keys(supportedDevices)?.map((o) => (
              <option key={`option-${o}`} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <FormHelperText>Type of device or OS</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Device version</FormLabel>
          <Select placeholder={cliBasicForm['cli-topology:device-version']}>
            {getDeviceTypeVersions(cliBasicForm['cli-topology:device-type'])?.map((o) => (
              <option key={`option-${o}`} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <FormHelperText>Version of device or OS</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Transport type</FormLabel>
          <Select placeholder={cliBasicForm['cli-topology:transport-type']}>
            {['ssh', 'telnet'].map((o) => (
              <option key={`option-${o}`} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <FormHelperText>CLI transport protocol</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <FormControl>
          <FormLabel>Host</FormLabel>
          <Input
            value={cliBasicForm['cli-topology:host']}
            onChange={(e) => setCliBasicForm({ ...cliBasicForm, ['cli-topology:host']: e.target.value })}
            placeholder="Host"
          />
          <FormHelperText>IP or hostname of the management endpoint on a device</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Port</FormLabel>
          <Input
            value={cliBasicForm['cli-topology:port']}
            onChange={(e) => setCliBasicForm({ ...cliBasicForm, ['cli-topology:port']: e.target.value })}
            placeholder="Port"
          />
          <FormHelperText>TCP port</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={3}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            value={cliBasicForm['cli-topology:username']}
            onChange={(e) => setCliBasicForm({ ...cliBasicForm, ['cli-topology:username']: e.target.value })}
            placeholder="Username"
          />
          <FormHelperText>Username credential</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={3}>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={cliBasicForm['cli-topology:password']}
              type={!showPassword ? 'password' : 'text'}
              onChange={(e) => setCliBasicForm({ ...cliBasicForm, ['cli-topology:password']: e.target.value })}
              placeholder="Password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormHelperText>Password credential</FormHelperText>
        </FormControl>
      </GridItem>
    </Grid>
  );
};

export default CliBasicForm;
