import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useForm, ValidationError } from '@formspree/react';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';

const FeedbackWidget: VoidFunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, handleSubmit] = useForm('mlevbkky');

  const handleToggleButtonClick = () => {
    setIsOpen((s) => !s);
  };

  return (
    <Box position="relative" width={16} height={16}>
      <IconButton
        aria-label="Send feedback"
        type="button"
        variant="solid"
        colorScheme={isOpen ? 'blackAlpha' : 'blue'}
        borderRadius="50%"
        width="full"
        height="full"
        onClick={handleToggleButtonClick}
        icon={<FeatherIcon icon={isOpen ? 'x' : 'message-circle'} size={28} />}
        boxShadow="lg"
        transition="all .2s ease-in-out"
      />
      {isOpen && (
        <Box
          as="form"
          onSubmit={handleSubmit}
          width={64}
          paddingX={4}
          paddingY={4}
          background="white"
          boxShadow="md"
          position="absolute"
          bottom={20}
          right={20}
          borderRadius="md"
        >
          <Heading as="h4" fontSize="lg">
            Submit an idea
          </Heading>
          <FormControl id="name" marginY={4}>
            <FormLabel fontSize="sm" fontWeight={600}>
              E-mail
            </FormLabel>
            <Input type="email" name="email" size="sm" placeholder="john.doe@example.com" />
          </FormControl>
          <ValidationError prefix="Email" field="email" errors={state.errors} />
          <FormControl id="message" marginY={4} isRequired>
            <FormLabel fontSize="sm" fontWeight={600}>
              Message
            </FormLabel>
            <Textarea name="message" size="sm" placeholder="What would you like us to implement?" />
          </FormControl>
          <ValidationError prefix="Message" field="message" errors={state.errors} />
          <FormControl>
            <Button type="submit" colorScheme="blue" isDisabled={state.submitting} size="sm">
              Send
            </Button>
          </FormControl>
          {state.succeeded && (
            <Flex
              position="absolute"
              inset={0}
              justifyContent="center"
              alignItems="center"
              background="white"
              flexDirection="column"
            >
              <Flex
                background="green"
                color="white"
                width={12}
                height={12}
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
              >
                <FeatherIcon icon="check" />
              </Flex>
              <Text fontWeight={600} marginTop={4}>
                Thank you for your feedback!
              </Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FeedbackWidget;
