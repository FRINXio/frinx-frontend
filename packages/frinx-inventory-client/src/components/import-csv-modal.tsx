import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import React, { ChangeEvent, useMemo, useRef, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  UploadFileMutation,
  UploadFileMutationVariables,
  ZonesImportQuery,
  ZonesImportQueryVariables,
} from '../__generated__/graphql';

const UPLOAD_FILE_MUTATION = gql`
  mutation UploadFile($input: CSVImportInput!) {
    deviceInventory {
      importCSV(input: $input) {
        isOk
      }
    }
  }
`;
const ZONES_QUERY = gql`
  query ZonesImport {
    deviceInventory {
      zones {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const uploadSchema = yup.object({
  file: yup.mixed().required(),
  zoneId: yup.string().required(),
});

type FormValues = {
  file: File | null;
  zoneId: string;
};

const INITIAL_VALUES = {
  file: null,
  zoneId: '',
};

type Props = {
  onClose: () => void;
};

const ImportCSVModal: VoidFunctionComponent<Props> = ({ onClose }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, uploadFile] = useMutation<UploadFileMutation, UploadFileMutationVariables>(UPLOAD_FILE_MUTATION);
  const [{ data, fetching }] = useQuery<ZonesImportQuery, ZonesImportQueryVariables>({ query: ZONES_QUERY });
  const { addToastNotification } = useNotifications();
  const { values, handleSubmit, setFieldValue, isValid } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: uploadSchema,
    validateOnMount: true,
    onSubmit: async (formData: FormValues) => {
      await uploadFile(
        {
          input: formData,
        },
        context,
      ).then((res) => {
        if (res.error?.name === 'CombinedError') {
          addToastNotification({
            content: 'We could not import all devices because some of the imported devices already exsits',
            type: 'error',
          });
        } else {
          addToastNotification({
            content: 'CSV imported successfully',
            type: 'success',
          });
        }
      });
      onClose();
    },
  });

  const handleOnFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files == null) {
      return;
    }
    setFieldValue('file', files[0]);
  };
  const handleOnZoneIdInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('zoneId', event.target.value);
  };

  if (data == null) {
    return null;
  }

  if (fetching) {
    return null;
  }

  const zones = data.deviceInventory.zones.edges.map((e) => e.node);

  return (
    <Modal isOpen onClose={onClose} size="5xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Import devices from CSV</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired id="file" my={6}>
              <FormLabel htmlFor="writeUpFile">CSV File</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon size={20} as={FeatherIcon} icon="file" />
                </InputLeftElement>
                <input
                  type="file"
                  accept=".csv"
                  name="file"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={handleOnFileInputChange}
                />
                <Input
                  data-cy="import-csv-modal-file"
                  placeholder="Your file ..."
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                  value={values.file?.name || ''}
                  readOnly
                />
              </InputGroup>
            </FormControl>
            <FormControl id="zoneId" my={6}>
              <FormLabel>UniConfig zone</FormLabel>
              <Select
                data-cy="import-csv-modal-zone"
                placeholder="Select zone for devices"
                onChange={handleOnZoneIdInputChange}
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button data-cy="import-csv-modal-close" onClick={onClose}>
                Close
              </Button>
              <Button data-cy="import-csv-modal-import" type="submit" colorScheme="blue" isDisabled={!isValid}>
                Import
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ImportCSVModal;
