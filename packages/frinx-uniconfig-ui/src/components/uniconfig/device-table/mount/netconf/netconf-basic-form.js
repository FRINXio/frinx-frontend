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

const NetconfBasicForm = ({ netconfBasicForm, setNetconfBasicForm }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
      <GridItem colSpan={6}>
        <FormControl>
          <FormLabel>Node ID</FormLabel>
          <Input
            value={netconfBasicForm['node-id']}
            onChange={(e) => setNetconfBasicForm({ ...netconfBasicForm, ['node-id']: e.target.value })}
            placeholder="Node ID"
          />
          <FormHelperText>Unique identifier of device across all systems</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={3}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            value={netconfBasicForm['netconf-node-topology:username']}
            onChange={(e) =>
              setNetconfBasicForm({ ...netconfBasicForm, ['netconf-node-topology:username']: e.target.value })
            }
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
              value={netconfBasicForm['netconf-node-topology:password']}
              type={!showPassword ? 'password' : 'text'}
              onChange={(e) =>
                setNetconfBasicForm({ ...netconfBasicForm, ['netconf-node-topology:password']: e.target.value })
              }
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
      <GridItem colSpan={4}>
        <FormControl>
          <FormLabel>Host</FormLabel>
          <Input
            value={netconfBasicForm['netconf-node-topology:host']}
            onChange={(e) =>
              setNetconfBasicForm({ ...netconfBasicForm, ['netconf-node-topology:host']: e.target.value })
            }
            placeholder="Host"
          />
          <FormHelperText>IP or hostname of the management endpoint on a device</FormHelperText>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Port</FormLabel>
          <Input
            value={netconfBasicForm['netconf-node-topology:port']}
            onChange={(e) =>
              setNetconfBasicForm({ ...netconfBasicForm, ['netconf-node-topology:port']: e.target.value })
            }
            placeholder="Port"
          />
          <FormHelperText>TCP port</FormHelperText>
        </FormControl>
      </GridItem>
    </Grid>
  );
};

export default NetconfBasicForm;
