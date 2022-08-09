import React, { FC, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  IconButton,
  InputGroup,
  InputRightElement,
  HStack,
  FormErrorMessage,
  Spacer,
  Box,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FormikErrors } from 'formik';
import { isObject } from 'lodash';

type PoolValue = Record<string, string>;
type Props = {
  resourceTypeName: string;
  existingPoolValues: PoolValue[];
  poolValuesErrors?: string | string[] | FormikErrors<Record<string, string>>[];
  onChange: (values: PoolValue[]) => void;
};

function getDefaultValue(name: string): PoolValue {
  switch (name) {
    case 'random_signed_int32':
      return { int: '' };
    case 'route_distinguisher':
      return { rd: '' };
    case 'ipv6_prefix':
    case 'ipv4_prefix':
    case 'ipv4':
    case 'ipv6':
      return { address: '', prefix: '' };
    case 'vlan':
      return {
        vlan: '',
      };
    case 'vlan_range':
      return { from: '', to: '' };
    default:
      return {};
  }
}

function getPlaceholder(name: string): PoolValue {
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

const PoolValuesForm: FC<Props> = ({ onChange, resourceTypeName, existingPoolValues, poolValuesErrors, children }) => {
  const [poolValues, setPoolValues] = useState<PoolValue[]>([getDefaultValue(resourceTypeName)]);

  useEffect(() => {
    setPoolValues([getDefaultValue(resourceTypeName)]);
    onChange([]);
  }, [resourceTypeName, onChange]);

  const errors =
    Array.isArray(poolValuesErrors) && poolValuesErrors.some(isObject)
      ? (poolValuesErrors as Array<Record<string, string>>)
      : undefined;

  const isErrorString = typeof poolValuesErrors === 'string';
  const isPoolValueInvalid = (index: number, key: string) =>
    isErrorString ? poolValuesErrors != null : errors != null && errors[index] != null && errors[index][key] != null;

  return (
    <>
      <HStack>
        <Box>{children}</Box>
        <Spacer />
        <Button
          size="sm"
          type="button"
          colorScheme="gray"
          onClick={() => {
            setPoolValues((prev) => [...prev, getDefaultValue(resourceTypeName)]);
          }}
        >
          Add new value
        </Button>
      </HStack>
      {poolValues.map((pv, index) => (
        <HStack>
          {Object.keys(pv).map((key) => {
            const value = pv[key];
            const isPristine = isEqual(existingPoolValues[index], poolValues[index]);
            return (
              <FormControl
                isRequired={index === 0}
                id={`${key}/${index}`}
                // eslint-disable-next-line react/no-array-index-key
                key={`${key}/${index}`}
                marginY={2}
                isInvalid={isPoolValueInvalid(index, key)}
              >
                <FormLabel>{key}</FormLabel>
                <InputGroup>
                  <Input
                    borderColor={isPristine ? 'blue.400' : 'inherit'}
                    name={`${key}/${index}`}
                    type="text"
                    value={value}
                    placeholder={getPlaceholder(resourceTypeName)[key]}
                    onChange={(event) => {
                      event.persist();
                      setPoolValues((prev) => {
                        const copy = [...prev];
                        copy[index] = { ...copy[index], [key]: event.target.value };
                        return copy;
                      });
                      onChange(poolValues);
                    }}
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      isDisabled={index === 0}
                      aria-label="remove"
                      icon={<DeleteIcon />}
                      onClick={() => {
                        setPoolValues((prev) => {
                          const newPoolValues = [...prev].filter((_, i) => i !== index);
                          return newPoolValues;
                        });
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
                {errors && errors[index] && <FormErrorMessage>{errors[index][key]}</FormErrorMessage>}
                {typeof poolValuesErrors === 'string' && <FormErrorMessage>{poolValuesErrors}</FormErrorMessage>}
              </FormControl>
            );
          })}
        </HStack>
      ))}
    </>
  );
};

export default PoolValuesForm;
