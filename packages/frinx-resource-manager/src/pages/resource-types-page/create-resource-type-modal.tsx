import React, { VoidFunctionComponent } from 'react';
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
  Spacer,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { useFormik } from 'formik';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (resourceTypeName: string) => void;
};

const validationSchema = yup.object({
  resourceTypeName: yup.string().required('Resource type name is required'),
});

const CreateResourceTypeModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, onCreate }) => {
  const { errors, values, handleChange, submitForm, isSubmitting, isValidating } = useFormik({
    initialValues: {
      resourceTypeName: '',
    },
    validationSchema,
    onSubmit: (data) => {
      onCreate(data.resourceTypeName);
      onClose();
    },
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Create Resource Type</ModalHeader>
        <ModalBody>
          <FormControl isRequired isInvalid={errors.resourceTypeName != null}>
            <FormLabel>Resource Type name</FormLabel>
            <Input name="resourceTypeName" onChange={handleChange} value={values.resourceTypeName} />
            <FormErrorMessage>{errors.resourceTypeName}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Spacer />
          <Button isLoading={isSubmitting || isValidating} colorScheme="blue" onClick={submitForm} type="submit">
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateResourceTypeModal;
