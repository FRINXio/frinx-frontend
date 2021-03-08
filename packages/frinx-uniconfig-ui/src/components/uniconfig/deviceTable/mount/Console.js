import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const Console = ({ outputConsole }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // scroll to bottom
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [outputConsole]);

  return (
    <Box bg="black" w="100%" h={200} maxH={200} overflowY="scroll" color="white" p={4}>
      {outputConsole.output.map((s, i) => (
        <p key={i}>{s}</p>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default Console;
