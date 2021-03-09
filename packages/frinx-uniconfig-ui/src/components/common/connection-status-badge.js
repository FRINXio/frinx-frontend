import React from 'react';
import { Tooltip, Badge } from '@chakra-ui/react';

const ConnectionStatusBadge = ({ node, checkConnectionStatus }) => {
  const getColor = (status) => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'connecting':
        return 'yellow';
      default:
        return 'red';
    }
  };

  return (
    <Tooltip label="Click to update status" aria-label="A tooltip">
      <Badge
        colorScheme={getColor(node.connectionStatus)}
        onClick={() => checkConnectionStatus(node)}
        style={{ cursor: 'pointer' }}
      >
        {node.connectionStatus}
      </Badge>
    </Tooltip>
  );
};

export default ConnectionStatusBadge;
