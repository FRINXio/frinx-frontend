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
import { FormikValues, useFormik } from 'formik';
import { unwrap } from '@frinx/shared';
import ExpectedProperties from '../create-strategy-page/expected-properties-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (resourceTypeName: string) => void;
};

type FormValues = {
  resourceTypeName: string;
  resourceTypeProperties?: { key: string; type: string }[];
};

// eslint-disable-next-line func-names
yup.addMethod(yup.array, 'unique', function (message, mapper = (a: unknown) => a) {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
            label="Claimed resource type structure"
            formErrors={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              duplicatePropertyKey: errors.resourceTypePropertiesDuplicate,
              propertyErrors: errors.resourceTypeProperties,
            }}
            expectedPropertyTypes={values.resourceTypeProperties}
            onPropertyAdd={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
            onPropertyChange={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
            onPropertyDelete={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
          />
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
