import React, { VoidFunctionComponent } from 'react';
import {
  Button,
  ButtonGroup,
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
} from '@chakra-ui/react';
import * as yup from 'yup';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import { unwrap } from '@frinx/shared';
import ExpectedProperties, { ExpectedProperty } from '../../components/expected-properties-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (resourceTypeName: string) => void;
};

type FormValues = {
  resourceTypeName: string;
  resourceTypeProperties?: ExpectedProperty[];
};

yup.addMethod(yup.array, 'unique', function unique(message, mapper = (a: unknown) => a) {
  return this.test('unique', message, (list, context) => {
    const l = unwrap(list);
    if (l.length !== new Set(l.map(mapper)).size) {
      // we want to have duplicate error in another path to be able
      // to distinguish it frow ordinary alternateId errors (key, value)
      throw context.createError({
        path: `${context.path}Duplicate`,
        message,
      });
    }

    return true;
  });
});

const validationSchema = yup.object({
  resourceTypeName: yup.string().required('Resource type name is required'),
  resourceTypeProperties: yup
    .array()
    .of(
      yup.object({
        key: yup.string().required('Key is required'),
        type: yup.string().required('Type is required'),
      }),
    )
    .unique('Resource type property keys cannot repeat', (a: FormikValues) => a.key),
});

const CreateResourceTypeModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, onCreate }) => {
  const { errors, values, handleChange, submitForm, isSubmitting, isValidating, setFieldValue } = useFormik<FormValues>(
    {
      initialValues: {
        resourceTypeName: '',
        resourceTypeProperties: [{ key: 'address', type: 'string' }],
      },
      validateOnBlur: false,
      validateOnChange: false,
      validationSchema,
      onSubmit: (data) => {
        onCreate(data.resourceTypeName);
        onClose();
      },
    },
  );

  const formErrors: FormikErrors<FormValues & { resourceTypePropertiesDuplicate?: string }> = errors;

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="3xl">
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

          <ExpectedProperties
            label="Expected resource type structure"
            formErrors={{
              duplicatePropertyKey: formErrors.resourceTypePropertiesDuplicate,
              propertyErrors: formErrors.resourceTypeProperties,
            }}
            expectedPropertyTypes={values.resourceTypeProperties}
            onPropertyAdd={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
            onPropertyChange={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
            onPropertyDelete={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button isLoading={isSubmitting || isValidating} colorScheme="blue" onClick={submitForm} type="submit">
              Create
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateResourceTypeModal;
