import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Heading,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared/src';
import { FormikErrors, useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';
import { AlternativeIdValue } from '../../../hooks/use-resource-pool-actions';
import AlternativeIdForm, { ValidationSchema as AlternativeIdSchema } from './alternative-id-form';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
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
  userInput?: string;
  alternativeIds: AlternativeId[];
};

const validationSchema = yup.object().shape({
  description: yup.string().required('Description is required'),
  userInput: yup.string(),
  alternativeIds: AlternativeIdSchema,
});

const ClaimCustomResourceModal: FC<Props> = ({ isOpen, onClaimWithAltId, onClose, poolName }) => {
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
        const { alternativeIds: formAlternativeIds, description, userInput } = formValues;

        const alternativeIdObject = formAlternativeIds.reduce((prev, curr) => {
          return {
            ...prev,
            [curr.key]: curr.value,
          };
        }, {} as Record<string, string | string[]>);

        onClaimWithAltId(alternativeIdObject, description, JSON.parse(userInput || '{}'));
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
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              <FormControl>
                <FormLabel>User input</FormLabel>
                <Editor
                  value={values.userInput}
                  onChange={handleChange}
                  name="userInput"
                  width="100%"
                  mode="json"
                  theme="tomorrow"
                />
              </FormControl>
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

export default ClaimCustomResourceModal;
