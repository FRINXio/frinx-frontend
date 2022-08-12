import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
} from '@chakra-ui/react';
import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import * as yup from 'yup';
import { LabelsInput } from '@frinx/shared/src';
import { DeleteIcon } from '@chakra-ui/icons';
import { FormikErrors } from 'formik';

const AlternativeIdSchema = yup.object({
  key: yup.string().required(),
  value: yup.array().of(yup.string()).min(1),
});

export const ValidationSchema = yup.array(AlternativeIdSchema);

type AlternativeId = {
  key: string;
  value: string[];
};

type Props = {
  alternativeIds: AlternativeId[];
  errors?: FormikErrors<AlternativeId>[];
  onChange: (aid: AlternativeId[]) => void;
};

const AlternativeIdForm: VoidFunctionComponent<Props> = (props: Props) => {
  const { alternativeIds, errors, onChange } = props;

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

  return (
    <Box paddingTop="2">
      <Button onClick={handleAdd}>Add alternative id</Button>
      {alternativeIds.map(({ key, value }, i) => {
        const keyError = errors?.[i]?.key;
        const valueError = errors?.[i]?.value;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={`alternative-id-${i}`}>
            {i === 0 && (
              <Flex paddingTop="2" marginRight="2">
                <FormLabel w={150} margin="0">
                  Key:
                </FormLabel>
                <FormLabel margin="0">Value:</FormLabel>
              </Flex>
            )}
            <HStack spacing="2" paddingTop="2" alignItems="flex-start">
              <FormControl maxW={150} isInvalid={keyError != null}>
                <Input value={key} placeholder="Key" onChange={(v) => handleKeyChange(v, i)} />
                <FormErrorMessage>{keyError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={valueError != null}>
                <LabelsInput
                  labels={value}
                  placeholder="Value (press Enter to add value)"
                  onChange={(values) => handleValueChange(values, i)}
                />
                <FormErrorMessage>{valueError}</FormErrorMessage>
              </FormControl>
              <IconButton icon={<DeleteIcon />} aria-label="Delete Alternative Id" onClick={() => handleDelete(i)} />
            </HStack>
          </Box>
        );
      })}
    </Box>
  );
};

export default AlternativeIdForm;
