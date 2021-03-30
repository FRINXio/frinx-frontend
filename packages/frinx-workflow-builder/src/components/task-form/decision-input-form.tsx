import React, { FC, useState } from 'react';
import { Box, Divider, FormControl, FormLabel, HStack, IconButton, Input } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { omitBy } from 'lodash';
import { DecisionInputParams } from '../../helpers/types';

type Props = {
  params: DecisionInputParams;
  onChange: (p: DecisionInputParams) => void;
};

const DecisionInputForm: FC<Props> = ({ params, onChange }) => {
  const [newParam, setNewParam] = useState<string>('');

  return (
    <>
      <Box width="50%">
        <FormControl my={2}>
          <FormLabel>Add new param</FormLabel>
          <HStack spacing={2}>
            <Input
              size="sm"
              type="text"
              variant="filled"
              value={newParam}
              onChange={(event) => {
                event.persist();
                setNewParam(event.target.value);
              }}
            />
            <IconButton
              size="sm"
              isDisabled={newParam === ''}
              aria-label="add param"
              colorScheme="blue"
              icon={<AddIcon />}
              onClick={() => {
                onChange({
                  ...params,
                  [newParam]: '',
                });
                setNewParam('');
              }}
            />
          </HStack>
        </FormControl>
      </Box>
      <Box width="50%">
        <Divider />
        {Object.keys(params).map((key) => (
          <FormControl id="param" my={2} key={key}>
            <FormLabel>{key}</FormLabel>
            <HStack spacing={2}>
              <Input
                name="param"
                variant="filled"
                value={params[key]}
                onChange={(event) => {
                  event.persist();
                  onChange({
                    ...params,
                    [key]: event.target.value,
                  });
                }}
              />
              <IconButton
                aria-label="remove param"
                colorScheme="red"
                icon={<DeleteIcon />}
                onClick={() => {
                  onChange(omitBy(params, (_, k) => k === key));
                }}
              />
            </HStack>
          </FormControl>
        ))}
      </Box>
    </>
  );
};

export default DecisionInputForm;
