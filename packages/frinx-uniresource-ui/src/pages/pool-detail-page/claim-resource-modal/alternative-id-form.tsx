import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import * as yup from 'yup';
import { LabelsInput, unwrap } from '@frinx/shared/src';
import { FormikErrors, FormikValues } from 'formik';
import FeatherIcon from 'feather-icons-react';

yup.addMethod(yup.array, 'unique', function unique(message, mapper = (a: unknown) => a) {
  return this.test('unique', message, (list, context) => {
    const l = unwrap(list);
    if (l.length !== new Set(l.map(mapper)).size) {
      // we want to have duplicate error in another path to be able
      // to distinguish it frow ordinary alternateId errors (key, value)
      throw context.createError({
        path: 'duplicateAlternativeIds',
        message,
      });
    }

    return true;
  });
});

const AlternativeIdSchema = yup.object({
  key: yup.string().required('Key is required'),
  value: yup.array().of(yup.string()),
});

export const ValidationSchema = yup.array(AlternativeIdSchema).unique('Keys cannot repeat', (a: FormikValues) => a.key);

export type AlternativeId = {
  key: string;
  value: string[];
};

type Props = {
  alternativeIds: AlternativeId[];
  errors?: FormikErrors<AlternativeId>[];
  duplicateError?: string;
  onChange: (aid: AlternativeId[]) => void;
} & Omit<BoxProps, 'onChange'>;

const AlternativeIdForm: VoidFunctionComponent<Props> = (props: Props) => {
  const { alternativeIds, errors, duplicateError, onChange, ...rest } = props;

  const handleAdd = () => {
    const newValues = [...alternativeIds, { key: 'status', value: ['active'] }];
    onChange(newValues);
  };

  const handleDelete = (index: number) => {
    const newValues = [...alternativeIds];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const handleValueChange = (changedValues: string[], changedIndex: number) => {
    const oldAlternativeId = alternativeIds[changedIndex];
    const newValues = [...alternativeIds];
    newValues.splice(changedIndex, 1, { ...oldAlternativeId, value: changedValues });
    onChange(newValues);
  };

  const handleKeyChange = (event: ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    const changedKey = event.currentTarget.value;
    const oldAlternativeId = alternativeIds[changedIndex];
    const newValues = [...alternativeIds];
    newValues.splice(changedIndex, 1, { ...oldAlternativeId, key: changedKey });
    onChange(newValues);
  };

  const canShowErrors = typeof errors === 'string';

  return (
    <Box {...rest}>
      {alternativeIds.length === 0 && (
        <Text color="gray.500" fontStyle="italic">
          You didn&apos;t add any alternative ids yet.
        </Text>
      )}
      {alternativeIds.length > 0 &&
        alternativeIds.map(({ key, value }, i) => {
          const keyError = errors?.[i]?.key;
          const valueError = errors?.[i]?.value;

          return (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={`alternative-id-${i}`}>
              <HStack spacing="2" paddingTop="2" align="flex-start">
                <FormControl maxW={150} isInvalid={keyError != null}>
                  {i === 0 && <FormLabel margin="0">Key:</FormLabel>}
                  <Input value={key} placeholder="Key" onChange={(v) => handleKeyChange(v, i)} />
                  <FormErrorMessage>{keyError}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={valueError != null}>
                  {i === 0 && <FormLabel margin="0">Value:</FormLabel>}
                  <HStack>
                    <LabelsInput
                      labels={value}
                      placeholder="Value (press Enter to add value)"
                      onChange={(values) => handleValueChange(values, i)}
                    />
                    <IconButton
                      icon={<Icon size="sm" as={FeatherIcon} icon="trash-2" />}
                      aria-label="Delete Alternative Id"
                      onClick={() => handleDelete(i)}
                    />
                  </HStack>
                  <FormErrorMessage>{valueError}</FormErrorMessage>
                </FormControl>
              </HStack>
            </Box>
          );
        })}
      <HStack mt={3}>
        <Spacer />
        <Button size="xs" onClick={handleAdd}>
          Add alternative id
        </Button>
      </HStack>
      {duplicateError && (
        <Text color="red.500" fontSize="14px" marginTop={2}>
          {duplicateError}
        </Text>
      )}
      {canShowErrors && (
        <Text color="red.500" fontSize="14px" marginTop={2}>
          {errors}
        </Text>
      )}
    </Box>
  );
};

export default AlternativeIdForm;
