import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Kbd,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import FeatherIcon from 'feather-icons-react';
import { FormikErrors } from 'formik';
import { FormValues } from './create-strategy-form';

export type ExpectedPoolProperty = { key: string; type: string };

type Props = {
  expectedPoolPropertyTypes?: ExpectedPoolProperty[];
  formErrors: FormikErrors<FormValues> & { duplicateExpectedPoolPropertyKey?: string };
  onPoolPropertyChange: (values: ExpectedPoolProperty[]) => void;
  onPoolPropertyAdd: (values: ExpectedPoolProperty[]) => void;
  onPoolPropertyDelete: (values: ExpectedPoolProperty[]) => void;
};

const ExpectedPoolProperties: FC<Props> = ({
  expectedPoolPropertyTypes = [],
  formErrors,
  onPoolPropertyAdd,
  onPoolPropertyDelete,
  onPoolPropertyChange,
}) => {
  const handleOnPoolPropertyAdd = () => onPoolPropertyAdd([...expectedPoolPropertyTypes, { key: '', type: '' }]);

  const handleOnPoolPropertyChange = (key: string, type: string, changedIndex: number) => {
    const changedPoolProperties = [
      ...expectedPoolPropertyTypes.slice(0, changedIndex),
      { key, type },
      ...expectedPoolPropertyTypes.slice(changedIndex + 1, expectedPoolPropertyTypes.length),
    ];

    onPoolPropertyChange(changedPoolProperties);
  };

  const handleOnPoolPropertyDelete = (index: number) => {
    const result = [
      ...expectedPoolPropertyTypes.slice(0, index),
      ...expectedPoolPropertyTypes.slice(index + 1, expectedPoolPropertyTypes.length),
    ];
    onPoolPropertyDelete(result);
  };

  const isErrorString = typeof formErrors.expectedPoolPropertyTypes === 'string';
  const isExpectedPoolPropertyTypesError = (index: number) =>
    formErrors.expectedPoolPropertyTypes != null &&
    formErrors.expectedPoolPropertyTypes[index] != null &&
    !isErrorString;

  return (
    <FormControl>
      <HStack mb={3} align="flex-start">
        <FormLabel>Expected pool properties</FormLabel>
        <Spacer />
        <Button size="sm" onClick={handleOnPoolPropertyAdd}>
          Add new pool property
        </Button>
      </HStack>
      {expectedPoolPropertyTypes.length === 0 ? (
        <Text>
          Click on button <Kbd>Add new pool property</Kbd> to add expected pool property
        </Text>
      ) : (
        expectedPoolPropertyTypes.map((poolProperty, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <HStack key={`expected-pool-property-${index}`} my={3} align="flex-start">
            <FormControl
              isInvalid={
                isExpectedPoolPropertyTypesError(index) &&
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                formErrors.expectedPoolPropertyTypes[index].key != null
              }
            >
              {index === 0 && <FormLabel>Key</FormLabel>}
              <Input
                value={poolProperty.key}
                onChange={(e) => handleOnPoolPropertyChange(e.target.value, poolProperty.type, index)}
                placeholder="Enter name of expected property"
              />
              {isExpectedPoolPropertyTypesError(index) && (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <FormErrorMessage>{formErrors.expectedPoolPropertyTypes[index].key}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isInvalid={
                isExpectedPoolPropertyTypesError(index) &&
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                formErrors.expectedPoolPropertyTypes[index].type != null
              }
            >
              {index === 0 && <FormLabel>Type</FormLabel>}
              <HStack>
                <Input
                  value={poolProperty.type}
                  onChange={(e) => handleOnPoolPropertyChange(poolProperty.key, e.target.value, index)}
                  placeholder="Enter type of expected property"
                />
                <IconButton
                  icon={<FeatherIcon icon="trash-2" size={20} />}
                  colorScheme="red"
                  aria-label="Delete pool property"
                  onClick={() => handleOnPoolPropertyDelete(index)}
                />
              </HStack>
              {isExpectedPoolPropertyTypesError(index) && (
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                <FormErrorMessage>{formErrors.expectedPoolPropertyTypes[index].type}</FormErrorMessage>
              )}
            </FormControl>
          </HStack>
        ))
      )}
      {formErrors.duplicateExpectedPoolPropertyKey != null && (
        <Text textColor="red">{formErrors.duplicateExpectedPoolPropertyKey}</Text>
      )}
    </FormControl>
  );
};

export default ExpectedPoolProperties;
