import React, { VoidFunctionComponent } from 'react';
import { Alert, AlertDescription, AlertIcon, Box } from '@chakra-ui/react';

type Props = {
  text: string;
};

const ErrorMessage: VoidFunctionComponent<Props> = ({ text }) => {
  return (
    <Box py="4">
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{text}</AlertDescription>
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
