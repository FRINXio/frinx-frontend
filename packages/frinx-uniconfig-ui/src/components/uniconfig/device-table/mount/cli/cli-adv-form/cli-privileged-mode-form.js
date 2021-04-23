import React, { useState } from 'react';
import {
  GridItem,
  FormControl,
  InputRightElement,
  Button,
  InputGroup,
  Input,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';

const CliPrivilegedModeForm = ({ cliAdvForm, setCliAdvForm, colSpan }) => {
  const [shouldShowSecret, setShouldShowSecret] = useState(false);

  return (
    <GridItem colSpan={4}>
      <FormControl>
        <FormLabel>Secret</FormLabel>
        <InputGroup>
          <Input
            value={cliAdvForm['cli-topology:secret']}
            type={!shouldShowSecret ? 'password' : 'text'}
            onChange={(e) => {
              e.persist();
              setCliAdvForm((prev) => ({ ...prev, 'cli-topology:secret': e.target.value }));
            }}
            placeholder="Secret"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShouldShowSecret(!shouldShowSecret)}>
              {shouldShowSecret ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>Used for entering privileged mode on cisco devices</FormHelperText>
      </FormControl>
    </GridItem>
  );
};

export default CliPrivilegedModeForm;
