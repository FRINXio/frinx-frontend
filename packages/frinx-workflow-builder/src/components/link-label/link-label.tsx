import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

const LinkLabel: FC = () => {
  return (
    <Box
      className="custom-link-label"
      opacity={0}
      zIndex="toast"
      paddingY={1}
      paddingX={2}
      background="gray.200"
      color="gray.900"
      position="relative"
      fontSize="70%"
      textTransform="uppercase"
      borderRadius="base"
      textAlign="center"
      maxWidth={24}
      transform="translateY(100%)"
    >
      Double-click to remove
    </Box>
  );
};

export default LinkLabel;
