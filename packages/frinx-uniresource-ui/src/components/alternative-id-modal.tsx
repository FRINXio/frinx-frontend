import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  VStack,
} from '@chakra-ui/react';
import { isArray, toArray } from 'lodash';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  isOpen: boolean;
  altIds: Record<string, string | string[]>;
  onClose: () => void;
};

const altIdValueItem = (altIds: Record<string, string | string[]>, altIdKeys: string[]) => {
  return (
    <Table size="sm">
      <Thead bgColor="gray.200">
        <Tr>
          <Th>Key</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {altIdKeys.map((altId) => {
          let badgeItem;
          if (isArray(altIds[altId])) {
            const arr = toArray(altIds[altId]);
            badgeItem = arr.map((id) => (
              <Text bgColor="gray.100" fontWeight="semibold" py={0.5} px={1} borderRadius="sm" key={id} fontSize="xs">
                {id}
              </Text>
            ));
          } else {
            badgeItem = (
              <Text fontSize="xs" bgColor="gray.100" fontWeight="semibold" py={0.5} px={1} borderRadius="sm">
                {altIds[altId]}
              </Text>
            );
          }

          return (
            <Tr key={altId}>
              <Td>
                <Text as="i">{altId}:</Text>
              </Td>
              <Td>
                <VStack alignItems="start">{badgeItem}</VStack>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

const AlternativeIdsModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, altIds }) => {
  const altIdKeys = Object.keys(altIds);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alternative Ids</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{altIdValueItem(altIds, altIdKeys)}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlternativeIdsModal;
