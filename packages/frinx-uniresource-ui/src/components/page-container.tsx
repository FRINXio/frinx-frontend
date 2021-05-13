import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';

const PageContainer: FC = ({ children }) => {
  return (
    <Box margin="auto" maxWidth="1200px">
      {children}
    </Box>
  );
};

export default PageContainer;
