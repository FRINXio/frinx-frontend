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
  Heading,
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
  userInput: yup.object().shape(
    {
      assignedNumber: yup
        .number()
        .typeError('This field must be a number')
        .positive('As number must be bigger than 0')
        .required('This field is required'),
      as: yup
        .number()
        .when('ipv4', {
          is: (val: string) => val == null || val.length === 0,
          then: yup.number().required('This field is required'),
          otherwise: yup.number(),
        })
        .typeError('Please provide number')
        .positive('As number must be bigger than 0'),
      ipv4: yup
        .string()
        .when('as', {
          is: (val: number) => val == null || val <= 0,
          then: yup.string().required('This field is required'),
          otherwise: yup.string(),
        })
        .matches(IPV4_REGEX, { message: 'Please enter a valid IPv4 address' }),
    },
    [['as', 'ipv4']],
  ),
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
      validateOnBlur: false,
      validateOnChange: false,
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
                <Input
                  id="assignedNumber"
                  placeholder="Enter a number"
                  name="userInput.assignedNumber"
                  value={values.userInput.assignedNumber}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.userInput?.assignedNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.userInput?.as != null} mb={3}>
                <FormLabel htmlFor="as">AS number</FormLabel>
                <Input
                  id="as"
                  name="userInput.as"
                  placeholder="Enter a number"
                  value={values.userInput.as}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.userInput?.as}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.userInput?.ipv4 != null} mb={3}>
                <FormLabel htmlFor="ipv4">IPv4 address</FormLabel>
                <Input
                  id="ipv4"
                  name="userInput.ipv4"
                  placeholder="Please enter an IPv4 address"
                  value={values.userInput.ipv4}
                  onChange={handleChange}
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

              <Heading fontSize="md" mt={5}>
                Alternative Id
              </Heading>

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
