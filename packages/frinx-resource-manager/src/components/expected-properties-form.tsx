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
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';
import { FormikErrors } from 'formik';

export type ExpectedProperty = { key: string; type: string };
type ExpectedPropertyErrors = {
  propertyErrors?: string | string[] | FormikErrors<ExpectedProperty>[];
  duplicatePropertyKey?: string;
};

type Props = {
  label?: string;
  expectedPropertyTypes?: ExpectedProperty[];
  formErrors: ExpectedPropertyErrors;
  onPropertyChange: (values: ExpectedProperty[]) => void;
  onPropertyAdd: (values: ExpectedProperty[]) => void;
  onPropertyDelete: (values: ExpectedProperty[]) => void;
};

function isValueNotString(
  value?: FormikErrors<ExpectedProperty> | string | null,
): value is Record<string, string> | null {
  if (value == null) {
    return false;
  }

  return typeof value !== 'string';
}

function getExpectedFieldError(
  index: number,
  formErrors?: ExpectedPropertyErrors | null,
): FormikErrors<ExpectedProperty> | null {
  if (formErrors == null || formErrors.propertyErrors == null || formErrors.propertyErrors.length === 0) {
    return null;
  }

  if (formErrors.propertyErrors[index] == null) {
    return null;
  }

  const propertyFieldError = formErrors.propertyErrors[index];
  const ensuredPropertyFieldError = isValueNotString(propertyFieldError) ? propertyFieldError : null;

  if (ensuredPropertyFieldError != null) {
    return ensuredPropertyFieldError;
  }

  return null;
}

const ExpectedProperties: VoidFunctionComponent<Props> = ({
  expectedPropertyTypes = [],
  formErrors,
  onPropertyAdd,
  onPropertyDelete,
  onPropertyChange,
  label = 'Expected properties',
}) => {
  const handleOnPoolPropertyAdd = () => {
    onPropertyAdd([...expectedPropertyTypes, { key: '', type: '' }]);
  };

  const handleOnPoolPropertyChange = (key: string, type: string, changedIndex: number) => {
    const changedPoolProperties = [
      ...expectedPropertyTypes.slice(0, changedIndex),
      { key, type },
      ...expectedPropertyTypes.slice(changedIndex + 1, expectedPropertyTypes.length),
    ];

    onPropertyChange(changedPoolProperties);
  };

  const handleOnPoolPropertyDelete = (index: number) => {
    const result = [
      ...expectedPropertyTypes.slice(0, index),
      ...expectedPropertyTypes.slice(index + 1, expectedPropertyTypes.length),
    ];
    onPropertyDelete(result);
  };

  return (
    <>
      <HStack my={3} align="flex-start">
        <Text fontWeight="semibold">{label}</Text>
        <Spacer />
        <Button data-cy="add-expected-property" size="sm" onClick={handleOnPoolPropertyAdd}>
          Add new expected property
        </Button>
      </HStack>
      {expectedPropertyTypes.length === 0 ? (
        <Text>
          Click on button <Kbd>Add new expected property</Kbd> to add expected property
        </Text>
      ) : (
        expectedPropertyTypes.map((poolProperty, index) => {
          const expectedFieldError = getExpectedFieldError(index, formErrors);

          return (
            // eslint-disable-next-line react/no-array-index-key
            <HStack key={`expected-property-${index}`} my={3} align="flex-start">
              <FormControl isInvalid={getExpectedFieldError(index, formErrors)?.key != null}>
                {index === 0 && <FormLabel>Key</FormLabel>}
                <Input
                  data-cy={`property-key-${index}`}
                  value={poolProperty.key}
                  onChange={(e) => handleOnPoolPropertyChange(e.target.value, poolProperty.type, index)}
                  placeholder="Enter name of expected property"
                />
                {expectedFieldError?.key != null && <FormErrorMessage>{expectedFieldError.key}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={expectedFieldError?.type != null}>
                {index === 0 && <FormLabel>Type</FormLabel>}
                <HStack>
                  <Input
                    data-cy={`property-type-${index}`}
                    value={poolProperty.type}
                    onChange={(e) => handleOnPoolPropertyChange(poolProperty.key, e.target.value, index)}
                    placeholder="Enter type of expected property"
                  />
                  <IconButton
                    data-cy={`property-delete-${index}`}
                    icon={<FeatherIcon icon="trash-2" size={20} />}
                    colorScheme="red"
                    aria-label="Delete property"
                    onClick={() => handleOnPoolPropertyDelete(index)}
                  />
                </HStack>
                {expectedFieldError?.type != null && <FormErrorMessage>{expectedFieldError.type}</FormErrorMessage>}
              </FormControl>
            </HStack>
          );
        })
      )}
      {formErrors.duplicatePropertyKey != null && <Text textColor="red">{formErrors.duplicatePropertyKey}</Text>}
    </>
  );
};

export default ExpectedProperties;
