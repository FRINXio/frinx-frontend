import React, { VoidFunctionComponent } from 'react';
import { FormControl, Input, HStack, FormErrorMessage, FormLabel, Spinner, Text } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { RequiredPoolPropertiesQuery } from '../../__generated__/graphql';
import { FormValues } from './create-pool-form';

type Props = {
  onChange: (values: { key: string; type: string; value: string | number }) => void;
  customPoolProperties?: RequiredPoolPropertiesQuery['QueryRequiredPoolProperties'];
  formValues: FormValues;
  poolPropertyErrors?: string | string[] | FormikErrors<Record<string, string>>;
  isLoadingPoolProperties: boolean;
};

type Placeholder = {
  FloatVal: number | null;
  IntVal: number | null;
  StringVal: string | null;
};

const CustomPoolPropertiesForm: VoidFunctionComponent<Props> = ({
  onChange,
  customPoolProperties,
  formValues,
  poolPropertyErrors,
  isLoadingPoolProperties,
}) => {
  if (isLoadingPoolProperties) {
    return (
      <HStack>
        <Spinner />
        <Text>We are loading pool properties...</Text>
      </HStack>
    );
  }

  if (customPoolProperties == null || isEmpty(customPoolProperties)) {
    return (
      <Text>There are no required pool properties for selected resource type to be able to create resource pool</Text>
    );
  }

  const errors = JSON.parse(JSON.stringify(poolPropertyErrors) || '{}');
  const placeholder = (placeholders: Placeholder) => {
    if (placeholders.FloatVal != null) {
      return placeholders.FloatVal;
    }
    if (placeholders.IntVal != null) {
      return placeholders.IntVal;
    }
    if (placeholders.StringVal != null) {
      return placeholders.StringVal;
    }
    return 'Enter value';
  };

  return (
    <HStack mt={2} align="flex-start">
      {customPoolProperties.map(({ Name, Type, ...placeholders }) => {
        return (
          <FormControl key={Name} id={Name} isInvalid={errors[Name] !== undefined} isRequired>
            <FormLabel htmlFor={Name}>{Name}</FormLabel>
            <Input
              name={Name}
              onChange={(e) =>
                onChange({
                  key: Name,
                  type: Type,
                  value: e.target.value,
                })
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              value={formValues[Name]}
              placeholder={String(placeholder(placeholders))}
            />
            {[errors[Name]] && <FormErrorMessage>{errors[Name]}</FormErrorMessage>}
          </FormControl>
        );
      })}
    </HStack>
  );
};

export default CustomPoolPropertiesForm;
