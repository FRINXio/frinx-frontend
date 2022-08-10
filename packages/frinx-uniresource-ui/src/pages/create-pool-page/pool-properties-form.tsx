import React, { VoidFunctionComponent } from 'react';
import { FormControl, Input, HStack, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { FormikErrors } from 'formik';

type PoolProperties = Record<string, string>;
type PoolPropertyTypes = Record<string, 'int' | 'string'>;
type Props = {
  onChange: (values: { key: string; type: 'int' | 'string'; value: string }) => void;
  poolProperties: PoolProperties;
  poolPropertyTypes: PoolPropertyTypes;
  poolPropertyErrors?: string | string[] | FormikErrors<Record<string, string>>;
  resourceTypeName: string;
};

function getPlaceholder(name: string): Record<string, string> {
  switch (name) {
    case 'random_signed_int32':
      return { int: '2147483648' };
    case 'route_distinguisher':
      return { rd: '1:1' };
    case 'ipv6_prefix':
    case 'ipv6':
      return { address: '2001:db8:1::', prefix: '64' };
    case 'ipv4_prefix':
    case 'ipv4':
      return { address: '192.168.0.1', prefix: '24' };
    case 'vlan':
      return { vlan: '1' };
    case 'vlan_range':
      return { from: '1', to: '4094' };
    default:
      return {};
  }
}

const PoolPropertiesForm: VoidFunctionComponent<Props> = ({
  onChange,
  poolProperties,
  poolPropertyTypes,
  poolPropertyErrors,
  resourceTypeName,
}) => {
  const errors = JSON.parse(JSON.stringify(poolPropertyErrors) || '{}');
  return (
    <HStack mt={2}>
      {Object.keys(poolProperties).map((pKey) => {
        const pValue = poolProperties[pKey];
        const pType = poolPropertyTypes[pKey];
        return (
          <FormControl key={pKey} id={pKey} isInvalid={errors[pKey] !== undefined} isRequired>
            <FormLabel htmlFor={pKey}>{pKey}</FormLabel>
            <Input
              placeholder={getPlaceholder(resourceTypeName)[pKey]}
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
            {[errors[pKey]] && <FormErrorMessage>{errors[pKey]}</FormErrorMessage>}
          </FormControl>
        );
      })}
    </HStack>
  );
};

export default PoolPropertiesForm;
