import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';

const RightDrawer: FC = ({ children }) => {
  return (
    <Box
      position="fixed"
      top={24}
      right={0}
      bottom={0}
      width={640}
      background="white"
      boxShadow="base"
      zIndex="sticky"
      overflowY="auto"
    >
      {children}
    </Box>
  );
};

export default RightDrawer;
