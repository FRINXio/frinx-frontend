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
import { useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

type FormValues = {
  description: string;
  userInput: {
    assignedNumber?: number;
    as?: number;
    ipv4?: string;
  };
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
      .required('Please enter an IPv4 address'),
  }),
});

const ClaimRouteDistinguisherResourceModal: FC<Props> = ({ poolName, onClaim, onClose, isOpen }) => {
  const { values, handleChange, handleSubmit, submitForm, isSubmitting, errors, resetForm, setFieldValue } =
    useFormik<FormValues>({
      initialValues: {
        description: '',
        userInput: {},
      },
      onSubmit: (formValues) => {
        onClaim(formValues.description, values.userInput);
        onClose();
        resetForm();
      },
      validationSchema,
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
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
                  onChange={(value) => setFieldValue('userInput', { ...values.userInput, assignedNumber: value })}
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
                  onChange={(value) => setFieldValue('userInput', { ...values.userInput, as: value })}
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
                  onChange={(e) => setFieldValue('userInput', { ...values.userInput, ipv4: e.target.value })}
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
