import { Box, Link } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onServicesSiteLinkClick: () => void;
  onCreateVpnSiteLinkClick: () => void;
  onEditVpnSiteLinkClick: () => void;
};

const Main: VoidFunctionComponent<Props> = ({
  onServicesSiteLinkClick,
  onCreateVpnSiteLinkClick,
  onEditVpnSiteLinkClick,
}) => {
  return (
    <Box padding={6} margin={6} background="white">
      <Box>
        <Link onClick={onServicesSiteLinkClick} to="/services">
          Services
        </Link>
      </Box>
      <Box>
        <Link onClick={onCreateVpnSiteLinkClick} to="/add-vpn-site">
          Create VPN Site
        </Link>
      </Box>
      <Box>
        <Link onClick={onEditVpnSiteLinkClick} to="/edit-vpn-site">
          Edit VPN Site
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
