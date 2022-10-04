import React, { VoidFunctionComponent } from 'react';
import { FormControl, Input, HStack, FormErrorMessage, FormLabel, Switch, Tooltip, Box } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import FeatherIcon from 'feather-icons-react';

type PoolProperties = Record<string, string | number>;
type PoolPropertyTypes = Record<string, 'int' | 'string' | 'bool'>;
type Props = {
  onChange: (values: { key: string; type: 'int' | 'string' | 'bool'; value: string | number | boolean }) => void;
  poolProperties: PoolProperties;
  poolPropertyTypes: PoolPropertyTypes;
  poolPropertyErrors?: string | string[] | FormikErrors<Record<string, string>>;
  resourceTypeName: string;
};

function getPlaceholder(name: string): Record<string, string> {
  switch (name) {
    case 'ipv6_prefix':
    case 'ipv6':
      return { address: '2001:db8:1::', prefix: '64', subnet: 'false' };
    case 'ipv4_prefix':
    case 'ipv4':
      return { address: '192.168.0.1', prefix: '24', subnet: 'false' };
    case 'random_signed_int32':
      return { from: '-2147483648', to: '2147483647' };
    case 'unique_id':
    case 'vlan':
    case 'vlan_range':
      return { from: '1', to: '4094' };
    default:
      return {};
  }
}

const PoolPropertyInput = ({
  placeholder,
  onChange,
  value,
  pKey,
  shouldBeNumber,
}: {
  pKey: string;
  placeholder: string;
  value: string | number;
  shouldBeNumber: boolean;
  onChange: (e: string | number) => void;
}) => {
  if (pKey === 'subnet') {
    return (
      <Switch
        name={pKey}
        onChange={(e) => {
          onChange(String(e.target.checked));
        }}
        value={value.toString()}
      />
    );
  }

  return (
    <Input
      placeholder={placeholder}
      name={pKey}
      onChange={(e) => {
        if (shouldBeNumber) {
          onChange(parseInt(e.target.value, 10));
        } else {
          onChange(e.target.value);
        }
      }}
      value={value}
    />
  );
};

const PoolPropertiesForm: VoidFunctionComponent<Props> = ({
  onChange,
  poolProperties,
  poolPropertyTypes,
  poolPropertyErrors,
  resourceTypeName,
}) => {
  const errors = JSON.parse(JSON.stringify(poolPropertyErrors) || '{}');

  return (
    <HStack mt={2} align="flex-start">
      {Object.keys(poolProperties).map((pKey) => {
        const pValue = poolProperties[pKey];
        const pType = poolPropertyTypes[pKey];
        const placeholder = getPlaceholder(resourceTypeName)[pKey];
        const shouldBeNumber = pType === 'int';

        return (
          pKey !== 'idFormat' && (
            <FormControl key={pKey} id={pKey} isInvalid={errors[pKey] !== undefined} isRequired={pKey !== 'subnet'}>
              <HStack mb={2}>
                <FormLabel htmlFor={pKey} m={0}>
                  {pKey}
                </FormLabel>
                {pKey === 'subnet' ? (
                  <Tooltip
                    label={
                      resourceTypeName.includes('_prefix')
                        ? `The subnet flag is responsible for the amount of allocated addresses. If the value is true, than the resource of this pool will have 2 more allocated addresses. If the value is false - the number of addresses in the resource will be equal to its size. Nested pools will have the same values as this.`
                        : `The subnet flag is responsible for the amount of allocated addresses. If the value is true - the first address and the last address will not be accessible. If the value is false, then the amount of addresses in this pool will be increased by 2 addresses - first and last.`
                    }
                  >
                    <Box>
                      <FeatherIcon icon="info" size={15} />
                    </Box>
                  </Tooltip>
                ) : null}
              </HStack>
              <PoolPropertyInput
                shouldBeNumber={shouldBeNumber}
                pKey={pKey}
                onChange={(e) => onChange({ key: pKey, type: pType, value: e })}
                placeholder={placeholder}
                value={pValue}
              />
              {[errors[pKey]] && <FormErrorMessage>{errors[pKey]}</FormErrorMessage>}
            </FormControl>
          )
        );
      })}
    </HStack>
  );
};

export default PoolPropertiesForm;
