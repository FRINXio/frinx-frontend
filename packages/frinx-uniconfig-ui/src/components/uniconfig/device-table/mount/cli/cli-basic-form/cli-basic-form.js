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
import FormInput from '../../../../../common/form-input';

const CliBasicForm = ({ cliBasicForm, setCliBasicForm, supportedDevices, getDeviceTypeVersions }) => {
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
      <GridItem colSpan={6}>
        <FormInput
          label="Node ID"
          value={cliBasicForm['network-topology:node-id']}
          onChange={(e) => {
            e.persist();
            setCliBasicForm((prev) => ({ ...prev, 'network-topology:node-id': e.target.value }));
          }}
          description="Unique identifier of device across all systems"
        />
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Device type</FormLabel>
          <Select
            value={cliBasicForm['cli-topology:device-type']}
            onChange={(e) => {
              e.persist();
              setCliBasicForm((prev) => ({ ...prev, 'cli-topology:device-type': e.target.value }));
            }}
          >
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
          <Select
            onChange={(e) => {
              e.persist();
              setCliBasicForm((prev) => ({ ...prev, 'cli-topology:device-version': e.target.value }));
            }}
          >
            {getDeviceTypeVersions(supportedDevices, cliBasicForm['cli-topology:device-type']).map((o) => (
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
          <Select
            onChange={(e) => {
              e.persist();
              setCliBasicForm((prev) => ({ ...prev, 'cli-topology:transport-type': e.target.value }));
            }}
          >
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
        <FormInput
          label="Host"
          value={cliBasicForm['cli-topology:host']}
          onChange={(e) => {
            e.persist();
            setCliBasicForm((prev) => ({ ...prev, 'cli-topology:host': e.target.value }));
          }}
          description="IP or hostname of the management endpoint on a device"
        />
      </GridItem>
      <GridItem colSpan={2}>
        <FormInput
          label="Port"
          value={cliBasicForm['cli-topology:port']}
          onChange={(e) => {
            e.persist();
            setCliBasicForm((prev) => ({ ...prev, 'cli-topology:port': e.target.value }));
          }}
          description="TCP port"
        />
      </GridItem>
      <GridItem colSpan={3}>
        <FormInput
          label="Username"
          value={cliBasicForm['cli-topology:username']}
          onChange={(e) => {
            e.persist();
            setCliBasicForm((prev) => ({ ...prev, 'cli-topology:username': e.target.value }));
          }}
          description="Username credential"
        />
      </GridItem>
      <GridItem colSpan={3}>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={cliBasicForm['cli-topology:password']}
              type={!shouldShowPassword ? 'password' : 'text'}
              onChange={(e) => setCliBasicForm((prev) => ({ ...prev, 'cli-topology:password': e.target.value }))}
              placeholder="Password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShouldShowPassword(!shouldShowPassword)}>
                {shouldShowPassword ? 'Hide' : 'Show'}
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
