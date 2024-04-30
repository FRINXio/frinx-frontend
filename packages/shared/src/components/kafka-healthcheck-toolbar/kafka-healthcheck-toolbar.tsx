import React from 'react';
import {
  Box,
  Button,
  ChakraProps,
  HStack,
  IconButton,
  Link,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  isKafkaHealthy: boolean;
  isKafkaHealthyError?: string | null;
  onReconnect: () => void;
  onClose: () => void;
};

const KafkaHealthCheckToolbar = ({
  isKafkaHealthy,
  isKafkaHealthyError,
  onClose,
  onReconnect,
  ...rest
}: Props & ChakraProps) => {
  const { isOpen: isOpenError, onOpen: onShowError, onClose: onCloseError } = useDisclosure();

  return (
    <HStack bgColor={isKafkaHealthy ? 'green.500' : 'red.500'} px={5} py={2} mb={5} {...rest}>
      <VStack align="start" spacing={0}>
        <HStack>
          <Text color="white">Kafka is {isKafkaHealthy ? 'healthy' : 'unhealthy'}.</Text>
          {!isKafkaHealthy && (
            <Button variant="link" onClick={onReconnect} colorScheme="blue">
              Try to reconnect
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
