import React from 'react';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Chip from '@material-ui/core/Chip';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const ConnectionStatusBadge = ({ node, checkConnectionStatus }) => {
  const getColor = (status) => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'connecting':
        return 'yellow';
    }
  };

  const style = {
    color: getColor(node.connectionStatus),
  };

  return (
    <Tooltip title="Click to update status">
      <Chip
        tooltip="Check"
        clickable
        onClick={() => checkConnectionStatus(node)}
        variant="outlined"
        size="small"
        icon={<FiberManualRecordIcon style={style} />}
        label={node.connectionStatus}
      />
    </Tooltip>
  );
};

export default ConnectionStatusBadge;
