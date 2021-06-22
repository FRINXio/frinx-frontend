import React, { useEffect, useState, VoidFunctionComponent } from 'react';
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
  InputLeftElement,
  Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon, CheckIcon } from '@chakra-ui/icons';

type PoolValue = Record<string, string>;
type Props = {
  resourceTypeName: string;
  onChange: (values: PoolValue[]) => void;
  existingPoolValues: PoolValue[];
};

function getDefaultValue(name: string): PoolValue {
  switch (name) {
    case 'random_signed_int32':
      return { int: '' };
    case 'route_distinguisher':
      return { rd: '' };
    case 'ipv6_prefix':
    case 'ipv4_prefix':
      return { address: '', prefix: '' };
    case 'ipv4':
    case 'ipv6':
      return { address: '' };
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

const PoolValuesForm: VoidFunctionComponent<Props> = ({ onChange, resourceTypeName, existingPoolValues }) => {
  const [poolValues, setPoolValues] = useState<PoolValue[]>([getDefaultValue(resourceTypeName)]);
  const isButtonDisabled = isEqual(poolValues, existingPoolValues);

  useEffect(() => {
    setPoolValues([getDefaultValue(resourceTypeName)]);
    onChange([]);
  }, [resourceTypeName, onChange]);

  return (
    <>
      {poolValues.map((pv, index) =>
        Object.keys(pv).map((key) => {
          const value = pv[key];
          const isPristine = isEqual(existingPoolValues[index], poolValues[index]);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <FormControl id={`${key}/${index}`} key={`${key}/${index}`} marginY={5}>
              <FormLabel>{key}</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  {isPristine && (
                    <Tooltip label="Saved">
                      <CheckIcon color="blue.400" />
                    </Tooltip>
                  )}
                </InputLeftElement>
                <Input
                  borderColor={isPristine ? 'blue.400' : 'inherit'}
                  name={`${key}/${index}`}
                  type="text"
                  value={value}
                  onChange={(event) => {
                    event.persist();
                    setPoolValues((prev) => {
                      const copy = [...prev];
                      copy[index] = { ...copy[index], [key]: event.target.value };
                      return copy;
                    });
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
            </FormControl>
          );
        }),
      )}
      <HStack spacing={4}>
        <Button
          size="sm"
          type="button"
          colorScheme="blackAlpha"
          isDisabled={isButtonDisabled}
          onClick={() => {
            onChange(poolValues);
          }}
        >
          Save pool values
        </Button>
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
    </>
  );
};

export default PoolValuesForm;
