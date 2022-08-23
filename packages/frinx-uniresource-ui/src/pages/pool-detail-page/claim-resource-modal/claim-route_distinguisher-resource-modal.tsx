import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
  Button,
  Textarea,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { FormikErrors, useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';
import { AlternativeIdValue } from '../../../hooks/use-resource-pool-actions';
import AlternativeIdForm, { ValidationSchema as AlternativeIdSchema } from './alternative-id-form';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  // onClaim: (description: string, userInput?: Record<string, number | string>) => void;
  onClaimWithAltId: (
    alternativeId: Record<string, AlternativeIdValue>,
    description: string,
    userInput?: Record<string, number | string>,
  ) => void;
};

type AlternativeId = {
  key: string;
  value: string[];
};

type FormValues = {
  description: string;
  userInput: {
    assignedNumber?: number;
    as?: number;
    ipv4?: string;
  };
  alternativeIds: AlternativeId[];
};

const IPV4_REGEX = /(^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$)/;

const validationSchema = yup.object().shape({
  description: yup.string().notRequired(),
  userInput: yup.object().shape({
    assignedNumber: yup.number().typeError('Please provide number').required('This field is required'),
    as: yup.number().typeError('Please provide number').required('This field is required'),
    ipv4: yup
      .string()
      .matches(IPV4_REGEX, { message: 'Please enter a valid IPv4 address' })
      .required('Please enter a IPv4 address'),
  }),
  alternativeIds: AlternativeIdSchema,
});

const ClaimRouteDistinguisherResourceModal: FC<Props> = ({ poolName, onClaimWithAltId, onClose, isOpen }) => {
  const { values, handleChange, handleSubmit, submitForm, isSubmitting, errors, resetForm, setFieldValue } =
    useFormik<FormValues>({
      initialValues: {
        description: '',
        userInput: {},
        alternativeIds: [
          {
            key: 'status',
            value: ['active'],
          },
        ],
      },
      onSubmit: (formValues) => {
        const { alternativeIds: formAlternativeIds, description, userInput } = formValues;
        const alternativeIdObject: Record<string, string | string[]> = {};

        formAlternativeIds.forEach(({ key, value }) => {
          if (value.length > 1) {
            alternativeIdObject[key] = value;
          }
          const [v] = value;
          alternativeIdObject[key] = v;
        });

        onClaimWithAltId(alternativeIdObject, description, userInput);
        onClose();
        resetForm();
      },
      validationSchema,
    });

  const handleAlternativeIdsChange = (changedAlternativeIds: AlternativeId[]) => {
    setFieldValue('alternativeIds', changedAlternativeIds);
  };
  type FormErrors = typeof errors & FormikErrors<{ duplicateAlternativeIds?: string }>;
  const formErrors: FormErrors = errors;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              <FormControl isRequired isInvalid={errors.userInput?.assignedNumber != null} mb={3}>
                <FormLabel htmlFor="assignedNumber">Assigned number</FormLabel>
                <NumberInput
                  id="assignedNumber"
                  value={values.userInput.assignedNumber}
                  onChange={(_: string, value: number) =>
                    setFieldValue('userInput', { ...values.userInput, assignedNumber: value })
                  }
                  name="userInput.assignedNumber"
                >
                  <NumberInputField placeholder="Enter a number" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.userInput?.assignedNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.userInput?.as != null} mb={3}>
                <FormLabel htmlFor="as">AS number</FormLabel>
                <NumberInput
                  id="as"
                  value={values.userInput.as}
                  onChange={(_: string, value: number) =>
                    setFieldValue('userInput', { ...values.userInput, as: value })
                  }
                  name="userInput.as"
                >
                  <NumberInputField placeholder="Enter a number" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.userInput?.as}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.userInput?.ipv4 != null} mb={3}>
                <FormLabel htmlFor="ipv4">IPv4 address</FormLabel>
                <Input
                  id="ipv4"
                  value={values.userInput.ipv4}
                  onChange={handleChange}
                  name="userInput.ipv4"
                  placeholder="Please enter IPv4"
                />
                <FormErrorMessage>{errors.userInput?.ipv4}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description != null} mb={3}>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  name="description"
                  placeholder="Please enter description"
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <AlternativeIdForm
                alternativeIds={values.alternativeIds}
                errors={errors.alternativeIds as FormikErrors<AlternativeId>[]}
                duplicateError={formErrors.duplicateAlternativeIds}
                onChange={handleAlternativeIdsChange}
              />
            </fieldset>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={submitForm} isLoading={isSubmitting}>
            Claim resource
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClaimRouteDistinguisherResourceModal;
