import { Box, Link } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onCreateVpnServiceLinkClick: () => void;
  onEditVpnServiceLinkClick: () => void;
  onCreateVpnSiteLinkClick: () => void;
  onEditVpnSiteLinkClick: () => void;
};

const Main: VoidFunctionComponent<Props> = ({
  onCreateVpnServiceLinkClick,
  onCreateVpnSiteLinkClick,
  onEditVpnServiceLinkClick,
  onEditVpnSiteLinkClick,
}) => {
  return (
    <Box padding={6} margin={6} background="white">
      <Box>
        <Link onClick={onCreateVpnServiceLinkClick} to="/add-vpn-service">
          Create VPN Service
        </Link>
      </Box>
      <Box>
        <Link onClick={onEditVpnServiceLinkClick} to="/edit-vpn-service">
          Edit VPN Service
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
