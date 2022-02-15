import {
  Box,
  Button,
  Code,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { CalculatedDiffQuery, CalculatedDiffQueryVariables, CalculatedDiffResult } from '../../__generated__/graphql';

const CALCULATED_DIFF_QUERY = gql`
  query calculatedDiff($deviceId: String!, $transactionId: String!) {
    calculatedDiff(deviceId: $deviceId, transactionId: $transactionId) {
      result {
        createdData {
          path
          data
        }
        deletedData {
          path
          data
        }
        updatedData {
          path
          data
        }
      }
    }
  }
`;

function getDiffTypeFromKey(key: string): string {
  switch (key) {
    case 'createdData':
      return 'Created:';
    case 'deletedData':
      return 'Deleted:';
    case 'updatedData':
      return 'Updated:';
    default:
      return '';
  }
}

function getColor(key: string): string {
  switch (key) {
    case 'createdData':
      return 'green.200';
    case 'deletedData':
      return 'red.200';
    case 'updatedData':
      return 'yellow.200';
    default:
      return 'grey';
  }
}

function isResultEmpty(result: CalculatedDiffResult): boolean {
  const { createdData, deletedData, updatedData } = result;
  return !createdData.length && !deletedData.length && !updatedData.length;
}

type Props = {
  onClose: () => void;
  deviceId: string;
  transactionId: string;
};

const DiffOutputModal: VoidFunctionComponent<Props> = ({ onClose, deviceId, transactionId }) => {
  const [{ data, fetching, error }] = useQuery<CalculatedDiffQuery, CalculatedDiffQueryVariables>({
    query: CALCULATED_DIFF_QUERY,
    variables: {
      deviceId,
      transactionId,
    },
    requestPolicy: 'network-only',
  });

  if (fetching || error != null) {
    return null;
  }

  if (data?.calculatedDiff == null) {
    return null;
  }

  const { result } = data.calculatedDiff;

  return (
    <Modal isOpen onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calculated diff output</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowX="auto">
          {isResultEmpty(result) && 'No diff'}
          {Object.entries(result).map(([key, value]) => {
            if (Array.isArray(value) && value.length) {
              return (
                <Box key={key} overflow="hidden">
                  <Heading
                    size="sm"
                    as="h3"
                    paddingY={2}
                    paddingX={4}
                    backgroundColor={getColor(key)}
                    color="blackAlpha.700"
                    borderRadius="md"
                  >
                    {getDiffTypeFromKey(key)}
                  </Heading>
                  {value.map((v) => (
                    <Box key={v.path} paddingY={2} paddingX={4}>
                      <Heading size="xs" as="h4" fontFamily="monospace">
                        {v.path}
                      </Heading>
                      <pre>
                        <Code key={v.path} width="100%" display="block">
                          {JSON.stringify(JSON.parse(v.data), null, 2)}
                        </Code>
                      </pre>
                    </Box>
                  ))}
                </Box>
              );
            }
            return null;
          })}
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiffOutputModal;
