import React from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';

type Props = {
  resourceProperties?: Record<string, string>;
  onClaimAddress: (formValues: FormValues) => void;
} & Omit<ModalProps, 'children'>;

type FormValues = {
  poolName: string;
  description: string;
};

const validationSchema = yup.object().shape({
  poolName: yup.string().required('Pool name is required'),
});

export function ClaimAddressModal({ onClaimAddress, resourceProperties, ...props }: Props) {
  const { handleSubmit, handleChange, values, errors, isSubmitting, isValidating } = useFormik<FormValues>({
    initialValues: {
      poolName: '',
      description: '',
    },
    validationSchema,
    onSubmit: (formValues) => {
      onClaimAddress(formValues);
      props.onClose();
    },
  });

  if (resourceProperties == null) {
    return (
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>There was a problem with claiming resource</ModalHeader>
          <ModalBody>
            <Text as="h3">This resource has no properties.</Text>
          </ModalBody>
          <ModalFooter>
            <Spacer />
            <Button variant="solid" colorScheme="blue" onClick={props.onClose}>
              Close modal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Claim address</ModalHeader>
        <ModalBody>
          <form id="poolForm" onSubmit={handleSubmit}>
            {/* pool name need to be unique per pool */}
            <FormControl isRequired isInvalid={errors.poolName != null} mb={4}>
              <FormLabel>Pool name:</FormLabel>
              <Input placeholder="Please enter name" name="poolName" onChange={handleChange} value={values.poolName} />
              <FormErrorMessage>{errors.poolName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description != null} mb={4}>
              <FormLabel>Description:</FormLabel>
              <Input
                placeholder="Please enter description"
                name="description"
                onChange={handleChange}
                value={values.description}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            <Input hidden type="submit" />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button form="poolForm" colorScheme="blue" type="submit" isLoading={isSubmitting || isValidating}>
            Claim address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
