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
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';

type Props = {
  poolName: string;
  resourceTypeName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

type FormValues = {
  description: string;
  userInput: string;
};

function getDefaultValue(name: string, poolProperties: Record<string, string>): Record<string, string> {
  switch (name) {
    case 'random_signed_int32':
      return { int: poolProperties.int };
    case 'route_distinguisher':
      return { rd: poolProperties.rd };
    case 'ipv6_prefix':
    case 'ipv6':
    case 'ipv4_prefix':
    case 'ipv4':
      return { address: poolProperties.address, prefix: poolProperties.prefix };
    case 'vlan':
    case 'vlan_range':
    case 'unique_id':
      return { from: poolProperties.from, to: poolProperties.to };
    default:
      return {};
  }
}

const validationSchema = (resourceTypeName: string) =>
  yup.object().shape({
    description: yup.string().notRequired(),
    userInput:
      resourceTypeName === 'ípv4_prefix' || resourceTypeName === 'ipv6_prefix' || resourceTypeName === 'vlan_range'
        ? yup.string().required('Cannot be empty')
        : yup.string().notRequired(),
  });

const ClaimResourceModal: FC<Props> = ({ poolName, onClaim, onClose, isOpen, resourceTypeName }) => {
  const shouldBeDesiredSize =
    resourceTypeName === 'vlan_range' || resourceTypeName === 'ipv4_prefix' || resourceTypeName === 'ipv6_prefix';
  const { values, handleChange, handleSubmit, submitForm, isSubmitting, errors } = useFormik<FormValues>({
    initialValues: {
      description: '',
      userInput: '',
    },
    onSubmit: (formValues) => {
      let userInput = {};

      if (shouldBeDesiredSize) {
        userInput = {
          desiredSize: formValues.userInput,
        };
      }

      if (!shouldBeDesiredSize && formValues.userInput) {
        userInput = {
          desiredValue: formValues.userInput,
        };
      }
      onClaim(formValues.description, userInput);
      onClose();
    },
    validationSchema: validationSchema(resourceTypeName),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              {shouldBeDesiredSize ? (
                <FormControl isRequired isInvalid={errors.userInput != null}>
                  <FormLabel>Desired size (number of allocated addresses)</FormLabel>
                  <Input value={values.userInput} onChange={handleChange} name="userInput" placeholder="254" />
                  <FormErrorMessage>{errors.userInput}</FormErrorMessage>
                </FormControl>
              ) : (
                <FormControl isInvalid={errors.userInput != null}>
                  <FormLabel>Desired value (optional input)</FormLabel>
                  <Input
                    value={values.userInput}
                    onChange={handleChange}
                    name="userInput"
                    placeholder={`Set specific value that you want to allocate from ${poolName}`}
                  />
                  <FormErrorMessage>{errors.userInput}</FormErrorMessage>
                </FormControl>
              )}

              <FormControl isInvalid={errors.description != null}>
                <FormLabel>Description</FormLabel>
                <Textarea
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

export default ClaimResourceModal;
