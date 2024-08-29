import { Box, Button, Divider, Flex, Heading, HStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { LspPathMetadata } from '../../../state.reducer';

type Props = {
  pathStart: string;
  pathEnd: string;
  metadata: LspPathMetadata;
  onClose: () => void;
};

const MplsLspPanel: VoidFunctionComponent<Props> = ({ pathStart, pathEnd, metadata, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const { fromDevice, toDevice, signalization, uptime } = metadata;

  return (
    <HStack
      position="absolute"
      top={2}
      right={2}
      background="white"
      borderRadius="md"
      paddingX={4}
      paddingY={6}
      boxShadow="md"
      spacing={4}
      alignItems="flex-start"
    >
      <Box>
        <Flex alignItems="center">
          <Heading as="h3" size="sm">
            {`${pathStart}-${pathEnd}`}
          </Heading>
        </Flex>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            Lsp Path Metadata
          </Heading>
        </Box>
        <Divider m={1} />
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            From Device
          </Heading>
          {fromDevice ?? '-'}
        </Box>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            To Device
          </Heading>
          {toDevice ?? '-'}
        </Box>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            Signalization
          </Heading>
          {signalization ?? '-'}
        </Box>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            Uptime
          </Heading>
          {uptime ?? '-'}
        </Box>
        <HStack spacing={2} marginTop={4}>
          <Button size="sm" onClick={handleClose}>
            Close
          </Button>
        </HStack>
      </Box>
    </HStack>
  );
};

export default MplsLspPanel;
