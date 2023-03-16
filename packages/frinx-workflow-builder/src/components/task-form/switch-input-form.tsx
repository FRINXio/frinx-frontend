import React, { FC, useState } from 'react';
import { Box, Divider, FormControl, FormLabel, HStack, IconButton, Input, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { omitBy } from 'lodash';
import { SwitchInputParams } from '@frinx/shared/src';

export const SwitchInputParamsSchema = yup.object({
  expression: yup.string().when('evaluatorType', {
    is: 'javascript',
    then: yup.string().required(),
    otherwise: yup
      .string()
      .matches(/^(\w+)$/)
      .required(),
  }),
  decisionCases: yup.array().of(
    yup.object({
      key: yup.string().required('decision key is required'),
      tasks: yup.array(yup.object().shape({})).required(),
    }),
  ),
});

type Props = {
  params: SwitchInputParams;
  errors: FormikErrors<{ inputParameters: SwitchInputParams }>;
  onChange: (p: SwitchInputParams) => void;
};

const SwitchInputForm: FC<Props> = ({ params, errors, onChange }) => {
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
              icon={<Icon as={FeatherIcon} icon="plus" size={20} />}
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
          <FormControl id="param" my={2} key={key} isInvalid={errors.inputParameters?.key != null}>
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
                icon={<Icon as={FeatherIcon} icon="trash-2" size={20} />}
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

export default SwitchInputForm;
