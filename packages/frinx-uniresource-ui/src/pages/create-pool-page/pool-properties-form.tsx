import React, { VoidFunctionComponent } from 'react';
import { FormControl, Input, HStack, Box, FormErrorMessage } from '@chakra-ui/react';
import { FormikErrors } from 'formik';

type FormValues = Partial<Record<string, unknown>>;
type PoolProperties = Record<string, string>;
type PoolPropertyTypes = Record<string, 'int' | 'string'>;
type Props = {
  onChange: (values: { key: string; type: 'int' | 'string'; value: string }) => void;
  poolProperties: PoolProperties;
  poolPropertyTypes: PoolPropertyTypes;
  errors: FormikErrors<FormValues>;
};

const PoolPropertiesForm: VoidFunctionComponent<Props> = ({ onChange, poolProperties, poolPropertyTypes, errors }) => {
  const formErrors = JSON.parse(JSON.stringify(errors.poolProperties ?? {}));
  return (
    <>
      {Object.keys(poolProperties).map((pKey) => {
        const pValue = poolProperties[pKey];
        const pType = poolPropertyTypes[pKey];
        return (
          <Box key={pKey}>
            <HStack spacing={2} marginY={5}>
              <FormControl id="type">
                <Input isReadOnly name="type" value={pType} />
              </FormControl>
              <FormControl id="key">
                <Input name="key" value={pKey} isReadOnly />
              </FormControl>
              <FormControl id={pKey} isInvalid={formErrors[pKey] !== undefined}>
                <Input
                  name={pKey}
                  onChange={(e) =>
                    onChange({
                      key: pKey,
                      type: pType,
                      value: e.target.value,
                    })
                  }
                  value={pValue}
                />
                {[formErrors[pKey]] && <FormErrorMessage>{formErrors[pKey]}</FormErrorMessage>}
              </FormControl>
            </HStack>
          </Box>
        );
      })}
    </>
  );
};

export default PoolPropertiesForm;
