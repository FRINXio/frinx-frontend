import { Box, Link } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onServicesSiteLinkClick: () => void;
  onSitesSiteLinkClick: () => void;
};

const Main: VoidFunctionComponent<Props> = ({ onServicesSiteLinkClick, onSitesSiteLinkClick }) => {
  return (
    <Box padding={6} margin={6} background="white">
      <Box>
        <Link onClick={onServicesSiteLinkClick} to="/services">
          Services
        </Link>
      </Box>
      <Box>
        <Link onClick={onSitesSiteLinkClick} to="/sites">
          Sites
        </Link>
      </Box>
      {/* <Box>
        <Link to="/add-site-network-access">Create Site Net Access</Link>
      </Box>
      <Box>
        <Link to="/edit-site-network-access">Edit Site Net Access</Link>
      </Box> */}
    </Box>
  );
};

export default Main;
