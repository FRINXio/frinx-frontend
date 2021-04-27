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
import FormInput from '../../../../../common/form-input';

const NetconfBasicForm = ({ netconfBasicForm, setNetconfBasicForm }) => {
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
      <GridItem colSpan={6}>
        <FormInput
          label="Node ID"
          value={netconfBasicForm['node-id']}
          onChange={(e) => {
            e.persist();
            setNetconfBasicForm((prev) => ({ ...prev, 'node-id': e.target.value }));
          }}
          description="Unique identifier of device across all systems"
        />
      </GridItem>
      <GridItem colSpan={3}>
        <FormInput
          label="Username"
          value={netconfBasicForm['netconf-node-topology:username']}
          onChange={(e) => {
            e.persist();
            setNetconfBasicForm((prev) => ({ ...prev, 'netconf-node-topology:username': e.target.value }));
          }}
          description="Username credential"
        />
      </GridItem>
      <GridItem colSpan={3}>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={netconfBasicForm['netconf-node-topology:password']}
              type={!shouldShowPassword ? 'password' : 'text'}
              onChange={(e) =>
                setNetconfBasicForm({ ...netconfBasicForm, ['netconf-node-topology:password']: e.target.value })
              }
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
      <GridItem colSpan={4}>
        <FormInput
          label="Host"
          value={netconfBasicForm['netconf-node-topology:host']}
          onChange={(e) => {
            e.persist();
            setNetconfBasicForm((prev) => ({ ...prev, 'netconf-node-topology:host': e.target.value }));
          }}
          description="IP or hostname of the management endpoint on a device"
        />
      </GridItem>
      <GridItem colSpan={2}>
        <FormInput
          label="Port"
          value={netconfBasicForm['netconf-node-topology:port']}
          onChange={(e) => {
            e.persist();
            setNetconfBasicForm((prev) => ({ ...prev, 'netconf-node-topology:port': e.target.value }));
          }}
          description="TCP port"
        />
      </GridItem>
    </Grid>
  );
};

export default NetconfBasicForm;
