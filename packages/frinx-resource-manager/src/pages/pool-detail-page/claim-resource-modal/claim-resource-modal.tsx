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
  Heading,
} from '@chakra-ui/react';
import { FormikErrors, useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';
import ipaddr from 'ipaddr.js';
import { AlternativeIdValue } from '../../../hooks/use-resource-pool-actions';
import AlternativeIdForm, { ValidationSchema as AlternativeIdSchema } from './alternative-id-form';

type Props = {
  poolName: string;
  resourceTypeName: string;
  isOpen: boolean;
  totalCapacity: bigint;
  poolProperties: Record<string, string>;
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
  userInput?: string | number;
  alternativeIds: AlternativeId[];
};

const IPV4_REGEX = /(^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$)/;
const IPV6_REGEX =
  /(^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)/;

function getHint(name: string, poolProperties: Record<string, string>, totalCapacity: bigint): string {
  switch (name) {
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
    case 'random_signed_int32':
    case 'vlan':
      return `Enter value between ${poolProperties.from} - ${poolProperties.to}`;
    default:
      return '';
  }
}

const validationSchema = (resourceTypeName: string) => {
  let userInputSchema;
  if (resourceTypeName === 'ipv4_prefix' || resourceTypeName === 'ipv6_prefix' || resourceTypeName === 'vlan_range') {
    userInputSchema = yup.number().typeError('Please enter a number').required('This field is required');
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
    alternativeIds: AlternativeIdSchema,
  });
};

const ClaimResourceModal: FC<Props> = ({
  poolName,
  onClose,
  isOpen,
  resourceTypeName,
  totalCapacity,
  poolProperties,
  onClaimWithAltId,
}) => {
  const shouldBeDesiredSize =
    resourceTypeName === 'vlan_range' || resourceTypeName === 'ipv4_prefix' || resourceTypeName === 'ipv6_prefix';
  const { values, handleChange, handleSubmit, submitForm, isSubmitting, errors, setFieldValue, resetForm } =
    useFormik<FormValues>({
      initialValues: {
        description: '',
        alternativeIds: [
          {
            key: 'status',
            value: ['active'],
          },
        ],
      },
      onSubmit: (formValues) => {
        let userInput = {};

        if (shouldBeDesiredSize) {
          userInput = {
            desiredSize: Number(formValues.userInput),
          };
        }

        if (!shouldBeDesiredSize && formValues.userInput) {
          userInput = {
            desiredValue: formValues.userInput,
          };
        }

        const { alternativeIds: formAlternativeIds, description } = formValues;

        const alternativeIdObject = formAlternativeIds.reduce((prev, curr) => {
          return {
            ...prev,
            [curr.key]: curr.value,
          };
        }, {} as Record<string, string | string[]>);

        onClaimWithAltId(alternativeIdObject, description, userInput);
        onClose();
        resetForm();
      },
      validationSchema: validationSchema(resourceTypeName),
      validateOnBlur: false,
      validateOnChange: false,
    });

  const handleAlternativeIdsChange = (changedAlternativeIds: AlternativeId[]) => {
    setFieldValue('alternativeIds', changedAlternativeIds);
  };

  const canShowDesiredValueInput =
    shouldBeDesiredSize || (resourceTypeName !== 'unique_id' && resourceTypeName !== 'random_signed_int32');

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
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              {shouldBeDesiredSize ? (
                <FormControl isRequired isInvalid={errors.userInput != null} mb={5}>
                  <FormLabel htmlFor="desiredSize">Desired size (number of allocated addresses)</FormLabel>
                  <Input
                    id="desiredSize"
                    name="userInput"
                    placeholder="Enter a number"
                    value={values.userInput}
                    onChange={handleChange}
                  />
                  <Text textColor="gray.400" fontSize="sm">
                    {getHint(resourceTypeName, poolProperties, totalCapacity)}
                  </Text>
                  <FormErrorMessage>{errors.userInput}</FormErrorMessage>
                </FormControl>
              ) : (
                canShowDesiredValueInput && (
                  <FormControl isInvalid={errors.userInput != null} mb={5}>
                    <FormLabel htmlFor="desiredValue">Desired value (optional input)</FormLabel>
                    <Input
                      placeholder={`Set specific value that you want to allocate from ${poolName}`}
                      name="userInput"
                      id="desiredValue"
                      value={values.userInput}
                      onChange={handleChange}
                    />
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

export default ClaimResourceModal;
