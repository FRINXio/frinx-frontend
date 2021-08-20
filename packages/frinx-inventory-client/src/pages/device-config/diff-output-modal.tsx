import {
  Button,
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
import { CalculatedDiffQuery, CalculatedDiffQueryVariables } from '../../__generated__/graphql';

const CALCULATED_DIFF_QUERY = gql`
  query calculatedDiff($deviceId: String!) {
    calculatedDiff(deviceId: $deviceId) {
      output
    }
  }
`;

type Props = {
  onClose: () => void;
  deviceId: string;
};

const DiffOutputModal: VoidFunctionComponent<Props> = ({ onClose, deviceId }) => {
  const [{ data, fetching, error }] = useQuery<CalculatedDiffQuery, CalculatedDiffQueryVariables>({
    query: CALCULATED_DIFF_QUERY,
    variables: {
      deviceId,
    },
    requestPolicy: 'network-only',
  });

  if (fetching || error != null) {
    return null;
  }

  const output = data?.calculatedDiff.output ?? '';

  return (
    <Modal isOpen onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calculated diff output</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <pre>
            <code>{JSON.stringify(JSON.parse(output), null, 2)}</code>
          </pre>
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
