import React, { FC } from 'react';
import { Box, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Main: FC = () => {
  return (
    <Box padding={6} margin={6} background="white">
      <Box>
        <ChakraLink as={Link} to="/add-vpn-service">
          Add Service
        </ChakraLink>
      </Box>
      <Box>
        <ChakraLink as={Link} to="/edit-vpn-service">
          Edit Service
        </ChakraLink>
      </Box>
    </Box>
  );
};

export default Main;
