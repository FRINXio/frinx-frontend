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
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';
import ipaddr from 'ipaddr.js';

type Props = {
  poolName: string;
  resourceTypeName: string;
  isOpen: boolean;
  totalCapacity: bigint;
  poolProperties: Record<string, string>;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

type FormValues = {
  description: string;
  userInput: string;
};

const IPV4_REGEX = /(^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$)/;
const IPV6_REGEX =
  /(^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)/;

function getHint(name: string, poolProperties: Record<string, string>, totalCapacity: bigint): string {
  switch (name) {
    case 'random_signed_int32':
      return poolProperties.int;
    case 'route_distinguisher':
      return poolProperties.rd;
    case 'ipv6':
      return `Your address should be between ${ipaddr.IPv6.networkAddressFromCIDR(
        `${poolProperties.address}/${poolProperties.prefix}`,
      )} and ${ipaddr.IPv6.broadcastAddressFromCIDR(`${poolProperties.address}/${poolProperties.prefix}`)}.`;
    case 'ipv6_prefix':
    case 'ipv4_prefix':
      return `Max number of allocated addresses can be ${totalCapacity}`;
    case 'vlan_range':
      return `Max vlan range can be ${totalCapacity}`;
    case 'ipv4':
      return `Your address should be between ${ipaddr.IPv4.networkAddressFromCIDR(
        `${poolProperties.address}/${poolProperties.prefix}`,
      )} and ${ipaddr.IPv4.broadcastAddressFromCIDR(`${poolProperties.address}/${poolProperties.prefix}`)}.`;
    case 'vlan':
      return `Enter value between ${poolProperties.from} - ${poolProperties.to}`;
    default:
      return '';
  }
}

const validationSchema = (resourceTypeName: string) => {
  let userInputSchema;
  if (resourceTypeName === 'ípv4_prefix' || resourceTypeName === 'ipv6_prefix' || resourceTypeName === 'vlan_range') {
    userInputSchema = yup.number().required();
  }

  if (resourceTypeName === 'ipv4') {
    userInputSchema = yup.string().matches(IPV4_REGEX, 'Please enter a valid IPv4 address').notRequired();
  }

  if (resourceTypeName === 'ipv6') {
    userInputSchema = yup.string().matches(IPV6_REGEX, 'Please enter a valid IPv6 address').notRequired();
  }
  return yup.object().shape({
    description: yup.string().notRequired(),
    userInput: userInputSchema || yup.number().typeError('Please enter a number').notRequired(),
  });
};

const ClaimResourceModal: FC<Props> = ({
  poolName,
  onClaim,
  onClose,
  isOpen,
  resourceTypeName,
  totalCapacity,
  poolProperties,
}) => {
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

  const canShowDesiredValueInput = shouldBeDesiredSize || resourceTypeName !== 'unique_id';
  const shouldBeNumber = resourceTypeName === 'vlan' || resourceTypeName === 'random_signed_int32';

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              {shouldBeDesiredSize ? (
                <FormControl isRequired isInvalid={errors.userInput != null} mb={5}>
                  <FormLabel>Desired size (number of allocated addresses)</FormLabel>
                  <NumberInput value={values.userInput} onChange={handleChange} name="userInput">
                    <NumberInputField placeholder="254" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text textColor="gray.400" fontSize="sm">
                    {getHint(resourceTypeName, poolProperties, totalCapacity)}
                  </Text>
                  <FormErrorMessage>{errors.userInput}</FormErrorMessage>
                </FormControl>
              ) : (
                canShowDesiredValueInput && (
                  <FormControl isInvalid={errors.userInput != null} mb={5}>
                    <FormLabel>Desired value (optional input)</FormLabel>
                    {shouldBeNumber ? (
                      <NumberInput value={values.userInput} onChange={handleChange} name="userInput">
                        <NumberInputField
                          placeholder={`Set specific value that you want to allocate from ${poolName}`}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    ) : (
                      <Input
                        value={values.userInput}
                        onChange={handleChange}
                        name="userInput"
                        placeholder={`Set specific value that you want to allocate from ${poolName}`}
                      />
                    )}
                    <Text textColor="gray.400" fontSize="sm">
                      {getHint(resourceTypeName, poolProperties, totalCapacity)}
                    </Text>
                    <FormErrorMessage>{errors.userInput}</FormErrorMessage>
                  </FormControl>
                )
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
