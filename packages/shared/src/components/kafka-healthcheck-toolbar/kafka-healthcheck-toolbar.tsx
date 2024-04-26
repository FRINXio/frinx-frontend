import React from 'react';
import { Box, Button, HStack, IconButton, Link, Spacer, Text, useDisclosure, VStack } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  isKafkaHealthy: boolean;
  isKafkaHealthyError?: string | null;
  onReconnect: () => void;
  onClose: () => void;
};

const KafkaHealthCheckToolbar = ({ isKafkaHealthy, isKafkaHealthyError, onClose, onReconnect }: Props) => {
  const { isOpen: isOpenError, onOpen: onShowError, onClose: onCloseError } = useDisclosure();

  return (
    <HStack bgColor={isKafkaHealthy ? 'green.500' : 'red.500'} rounded="md" p={5} mb={5}>
      <VStack align="start" spacing={0}>
        <HStack>
          <Text color="white">Kafka is {isKafkaHealthy ? 'healthy' : 'unhealthy'}</Text>
          {!isKafkaHealthy && (
            <Button as={Link} onClick={onReconnect}>
              Reconnect
            </Button>
          )}
        </HStack>

        {isKafkaHealthyError && (
          <Box>
            <Text>{isKafkaHealthyError}</Text>
            {isOpenError ? (
              <Button as={Link} onClick={onCloseError}>
                See less about error
              </Button>
            ) : (
              <Button as={Link} onClick={onShowError}>
                See more about error
              </Button>
            )}
          </Box>
        )}
      </VStack>

      <Spacer />

      <IconButton
        aria-label="Close kafka health check toolbar"
        icon={<FeatherIcon icon="x" size={28} />}
        onClick={onClose}
        color="white"
        bgColor="transparent"
      />
    </HStack>
  );
};

export default KafkaHealthCheckToolbar;
