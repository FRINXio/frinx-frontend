import {
  Box,
  Button,
  Code,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';

type Diff = {
  path: string;
  dataBefore: string | null;
  dataAfter: string | null;
};
type Change = {
  device: { id: string; name: string };
  diff: Diff[];
};
type Props = {
  isLoading: boolean;
  changes: Change[];
  onClose: () => void;
  onRevertBtnClick: () => void;
};

const TransactionDiffModal: VoidFunctionComponent<Props> = ({ changes, onClose, onRevertBtnClick, isLoading }) => {
  return (
    <Modal isOpen onClose={onClose} size="6xl" scrollBehavior="inside" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Revert transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {changes.map((change) => {
            const { device, diff } = change;
            return (
              <Box key={device.id} overflow="hidden">
                <Heading
                  size="md"
                  as="h2"
                  paddingY={2}
                  paddingX={4}
                  borderRadius="md"
                  backgroundColor="gray.200"
                  marginBottom={4}
                >
                  {device.name}
                </Heading>
                {diff.map((d) => {
                  return (
                    <Box key={d.path} paddingY={2} paddingX={4}>
                      <Heading as="h3" size="sm" fontFamily="monospace">
                        {d.path}
                      </Heading>
                      {d.dataBefore != null ? (
                        <Box marginY={2}>
                          <Heading
                            size="xs"
                            as="h5"
                            backgroundColor="red.300"
                            borderRadius="md"
                            color="blackAlpha.700"
                            paddingY={2}
                            paddingX={4}
                            display="flex"
                            alignItems="center"
                          >
                            <Icon as={FeatherIcon} icon="minus-square" size={24} marginRight={2} />
                            Deleted
                          </Heading>
                          <pre>
                            <Code width="full" display="block" backgroundColor="red.50">
                              {JSON.stringify(JSON.parse(d.dataBefore), null, 2)}
                            </Code>
                          </pre>
                        </Box>
                      ) : null}
                      {d.dataAfter != null ? (
                        <Box marginY={2}>
                          <Heading
                            size="xs"
                            as="h5"
                            backgroundColor="green.300"
                            borderRadius="md"
                            color="blackAlpha.700"
                            paddingY={2}
                            paddingX={4}
                            display="flex"
                            alignItems="center"
                          >
                            <Icon as={FeatherIcon} icon="plus-square" size={24} marginRight={2} />
                            Added
                          </Heading>
                          <pre>
                            <Code width="full" display="block" backgroundColor="green.50">
                              {JSON.stringify(JSON.parse(d.dataAfter), null, 2)}
                            </Code>
                          </pre>
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button onClick={onClose} isDisabled={isLoading}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onRevertBtnClick} isLoading={isLoading}>
              Revert changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionDiffModal;
