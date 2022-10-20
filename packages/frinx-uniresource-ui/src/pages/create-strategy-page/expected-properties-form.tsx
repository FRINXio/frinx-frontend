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

export type ExpectedPoolProperty = { key: string; type: string };

type Props = {
  label?: string;
  expectedPoolPropertyTypes?: ExpectedPoolProperty[];
  formErrors: { propertyErrors: ExpectedPoolProperty[]; duplicatePropertyKey?: string };
  onPropertyChange: (values: ExpectedPoolProperty[]) => void;
  onPropertyAdd: (values: ExpectedPoolProperty[]) => void;
  onPropertyDelete: (values: ExpectedPoolProperty[]) => void;
};

const ExpectedProperties: FC<Props> = ({
  expectedPoolPropertyTypes = [],
  formErrors,
  onPropertyAdd,
  onPropertyDelete,
  onPropertyChange,
  label = 'Expected properties',
}) => {
  const handleOnPoolPropertyAdd = () => onPropertyAdd([...expectedPoolPropertyTypes, { key: '', type: '' }]);

  const handleOnPoolPropertyChange = (key: string, type: string, changedIndex: number) => {
    const changedPoolProperties = [
      ...expectedPoolPropertyTypes.slice(0, changedIndex),
      { key, type },
      ...expectedPoolPropertyTypes.slice(changedIndex + 1, expectedPoolPropertyTypes.length),
    ];

    onPropertyChange(changedPoolProperties);
  };

  const handleOnPoolPropertyDelete = (index: number) => {
    const result = [
      ...expectedPoolPropertyTypes.slice(0, index),
      ...expectedPoolPropertyTypes.slice(index + 1, expectedPoolPropertyTypes.length),
    ];
    onPropertyDelete(result);
  };

  const isErrorString = typeof formErrors.propertyErrors === 'string';
  const isExpectedPoolPropertyTypesError = (index: number) =>
    formErrors.propertyErrors != null && formErrors.propertyErrors[index] != null && !isErrorString;

  return (
    <>
      <HStack my={3} align="flex-start">
        <Text fontWeight="bold">{label}</Text>
        <Spacer />
        <Button size="sm" onClick={handleOnPoolPropertyAdd}>
          Add new expected property
        </Button>
      </HStack>
      {expectedPoolPropertyTypes.length === 0 ? (
        <Text>
          Click on button <Kbd>Add new expected property</Kbd> to add expected property
        </Text>
      ) : (
        expectedPoolPropertyTypes.map((poolProperty, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <HStack key={`expected-property-${index}`} my={3} align="flex-start">
            <FormControl
              isInvalid={
                isExpectedPoolPropertyTypesError(index) &&
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
              {isExpectedPoolPropertyTypesError(index) && (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <FormErrorMessage>{formErrors.propertyErrors[index].key}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isInvalid={
                isExpectedPoolPropertyTypesError(index) &&
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
              {isExpectedPoolPropertyTypesError(index) && (
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
