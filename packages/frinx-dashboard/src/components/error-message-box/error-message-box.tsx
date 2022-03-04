import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

const ErrorMessageBox: FC = ({ children }) => {
  return (
    <Box
      position="fixed"
      top={4}
      minWidth={96}
      left="50%"
      transform="translateX(-50%)"
      paddingY={4}
      paddingX={8}
      borderRadius="md"
      zIndex="modal"
      background="white"
      borderTop={4}
      borderStyle="solid"
      borderColor="red"
      textAlign="center"
    >
      {children}
    </Box>
  );
};

export default ErrorMessageBox;
