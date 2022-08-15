import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import React, { FC } from 'react';
import { FormikErrors, useFormik } from 'formik';
import * as yup from 'yup';
import AlternativeIdForm, { ValidationSchema as AlternativeIdSchema } from './alternative-id-form';
import ClaimResourceLayout from '../claim-resource-layout';
import { AlternativeIdValue } from '../../../../hooks/use-resource-pool-actions';

type AlternativeId = {
  key: string;
  value: string[];
};

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
  onClaimWithAltId: (
    alternativeId: Record<string, AlternativeIdValue>,
    description: string,
    userInput?: Record<string, number | string>,
  ) => void;
};

const ClaimResourceAllocIpv6PrefixModal: FC<Props> = ({ poolName, isOpen, onClaimWithAltId, onClose }) => {
  const alternativeIds: AlternativeId[] = [];
  const { values, errors, handleChange, setFieldValue, submitForm } = useFormik({
    initialValues: {
      desiredSize: 254,
      description: '',
      alternativeIds,
    },
    validationSchema: yup.object({
      description: yup.string().required(),
      desiredSize: yup.number().required(),
      alternativeIds: AlternativeIdSchema,
    }),
    onSubmit: (formValues) => {
      const { alternativeIds: formAlternativeIds, description, desiredSize } = formValues;
      const alternativeIdObject: Record<string, string | string[]> = {};

      formAlternativeIds.forEach(({ key, value }) => {
        if (value.length > 1) {
          alternativeIdObject[key] = value;
        }
        const [v] = value;
        alternativeIdObject[key] = v;
      });

      onClaimWithAltId(alternativeIdObject, description, {
        desiredSize,
      });
      onClose();
    },
  });

  const handleAlternativeIdsChange = (changedAlternativeIds: AlternativeId[]) => {
    setFieldValue('alternativeIds', changedAlternativeIds);
  };

  type FormErrors = typeof errors & FormikErrors<{ duplicateAlternativeIds?: string }>;
  const formErrors: FormErrors = errors;

  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: submitForm }}>
      <form>
        <FormControl isRequired isInvalid={errors.desiredSize != null}>
          <FormLabel>Desired size (number of allocated addresses)</FormLabel>
          <Input id="desiredSize" name="desiredSize" onChange={handleChange} />
          <FormErrorMessage>{errors.desiredSize}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description != null}>
          <FormLabel>Description</FormLabel>
          <Input id="description" name="description" onChange={handleChange} placeholder="Please enter description" />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>
        <AlternativeIdForm
          alternativeIds={values.alternativeIds}
          errors={errors.alternativeIds as FormikErrors<AlternativeId>[]}
          duplicateError={formErrors.duplicateAlternativeIds}
          onChange={handleAlternativeIdsChange}
        />
      </form>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocIpv6PrefixModal;
