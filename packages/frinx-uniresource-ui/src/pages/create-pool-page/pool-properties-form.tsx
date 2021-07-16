import React, { useState, VoidFunctionComponent } from 'react';
import { FormControl, Input, IconButton, HStack, Select } from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

type PoolProperties = Record<string, string>;
type PoolPropertyTypes = Record<string, 'int' | 'string'>;
type Props = {
  onChange: (values: { key: string; type: 'int' | 'string'; value: string }) => void;
  onDeleteBtnClick: (key: string) => void;
  poolProperties: PoolProperties;
  poolPropertyTypes: PoolPropertyTypes;
};

const PoolPropertiesForm: VoidFunctionComponent<Props> = ({
  onChange,
  poolProperties,
  poolPropertyTypes,
  onDeleteBtnClick,
}) => {
  const [type, setType] = useState<'int' | 'string'>('int');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  return (
    <>
      {Object.keys(poolProperties).map((pKey) => {
        const pValue = poolProperties[pKey];
        const pType = poolPropertyTypes[pKey];
        return (
          <HStack spacing={2} key={pKey} marginY={5}>
            <FormControl id="type">
              <Input isReadOnly name="type" value={pType} />
            </FormControl>
            <FormControl id="key">
              <Input name="key" value={pKey} isReadOnly />
            </FormControl>
            <FormControl id={pKey}>
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
            </FormControl>
            <IconButton
              colorScheme="red"
              size="sm"
              icon={<DeleteIcon />}
              aria-label="delete"
              onClick={() => {
                onDeleteBtnClick(pKey);
              }}
            />
          </HStack>
        );
      })}
      <HStack spacing={2} marginY={5}>
        <FormControl id="type">
          <Select
            name="type"
            value={type}
            onChange={(event) => {
              setType(event.target.value as 'int' | 'string');
            }}
          >
            <option value="int">int</option>
            <option value="string">string</option>
          </Select>
        </FormControl>
        <FormControl id="key">
          <Input
            name="key"
            placeholder="key"
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
            }}
          />
        </FormControl>
        <FormControl id="value">
          <Input
            name="value"
            placeholder="value"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </FormControl>
        <IconButton
          colorScheme="green"
          size="sm"
          icon={<AddIcon />}
          aria-label="add"
          onClick={() => {
            onChange({
              key,
              type,
              value,
            });
            setKey('');
            setValue('');
            setType('int');
          }}
        />
      </HStack>
    </>
  );
};

export default PoolPropertiesForm;
