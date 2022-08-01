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
import FeatherIcon from 'feather-icons-react';
import React, { ChangeEvent, FormEvent, useMemo, useRef, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  UploadFileMutation,
  UploadFileMutationVariables,
  ZonesImportQuery,
  ZonesImportQueryVariables,
} from '../__generated__/graphql';

const UPLOAD_FILE_MUTATION = gql`
  mutation UploadFile($input: CSVImportInput!) {
    importCSV(input: $input) {
      isOk
    }
  }
`;
const ZONES_QUERY = gql`
  query ZonesImport {
    zones {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

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
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);

  const handleOnFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files == null) {
      return;
    }
    setValues((vals) => ({
      ...vals,
      file: files[0],
    }));
  };
  const handleOnZoneIdInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((vals) => ({
      ...vals,
      zoneId: event.target.value,
    }));
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await uploadFile(
      {
        input: values,
      },
      context,
    );
    onClose();
  };

  if (data == null) {
    return null;
  }

  if (fetching) {
    return null;
  }

  const zones = data.zones.edges.map((e) => e.node);

  return (
    <Modal isOpen onClose={onClose} size="5xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleFormSubmit}>
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
                placeholder="Your file ..."
                onClick={() => {
                  inputRef.current?.click();
                }}
                value={values.file?.name}
              />
            </InputGroup>
          </FormControl>
          <FormControl id="zoneId" my={6}>
            <FormLabel>UniConfig zone</FormLabel>
            <Select placeholder="Select zone for devices" onChange={handleOnZoneIdInputChange}>
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
            <Button onClick={onClose}>Close</Button>
            <Button type="submit" colorScheme="blue">
              Import
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportCSVModal;
