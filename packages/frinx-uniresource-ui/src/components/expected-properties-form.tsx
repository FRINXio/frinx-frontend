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

export type ExpectedProperty = { key: string; type: string };

type Props = {
  label?: string;
  expectedPropertyTypes?: ExpectedProperty[];
  formErrors: { propertyErrors?: ExpectedProperty[] | string; duplicatePropertyKey?: string };
  onPropertyChange: (values: ExpectedProperty[]) => void;
  onPropertyAdd: (values: ExpectedProperty[]) => void;
  onPropertyDelete: (values: ExpectedProperty[]) => void;
};

const ExpectedProperties: FC<Props> = ({
  expectedPropertyTypes = [],
  formErrors,
  onPropertyAdd,
  onPropertyDelete,
  onPropertyChange,
  label = 'Expected properties',
}) => {
  const handleOnPoolPropertyAdd = () => onPropertyAdd([...expectedPropertyTypes, { key: '', type: '' }]);

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

  const isErrorString = typeof formErrors.propertyErrors === 'string';
  const isExpectedPropertyTypesError = (index: number) =>
    formErrors.propertyErrors != null && formErrors.propertyErrors[index] != null && !isErrorString;

  return (
    <>
      <HStack my={3} align="flex-start">
        <Text fontWeight="semibold">{label}</Text>
        <Spacer />
        <Button size="sm" onClick={handleOnPoolPropertyAdd}>
          Add new expected property
        </Button>
      </HStack>
      {expectedPropertyTypes.length === 0 ? (
        <Text>
          Click on button <Kbd>Add new expected property</Kbd> to add expected property
        </Text>
      ) : (
        expectedPropertyTypes.map((poolProperty, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <HStack key={`expected-property-${index}`} my={3} align="flex-start">
            <FormControl
              isInvalid={
                isExpectedPropertyTypesError(index) &&
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                formErrors.propertyErrors[index].key != null
              }
            >
              {index === 0 && <FormLabel>Key</FormLabel>}
              <Input
                value={poolProperty.key}
                onChange={(e) => handleOnPoolPropertyChange(e.target.value, poolProperty.type, index)}
                placeholder="Enter name of expected property"
              />
              {isExpectedPropertyTypesError(index) && (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <FormErrorMessage>{formErrors.propertyErrors[index].key}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isInvalid={
                isExpectedPropertyTypesError(index) &&
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                formErrors.propertyErrors[index].type != null
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
                  aria-label="Delete property"
                  onClick={() => handleOnPoolPropertyDelete(index)}
                />
              </HStack>
              {isExpectedPropertyTypesError(index) && (
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                <FormErrorMessage>{formErrors.propertyErrors[index].type}</FormErrorMessage>
              )}
            </FormControl>
          </HStack>
        ))
      )}
      {formErrors.duplicatePropertyKey != null && <Text textColor="red">{formErrors.duplicatePropertyKey}</Text>}
    </>
  );
};

export default ExpectedProperties;
