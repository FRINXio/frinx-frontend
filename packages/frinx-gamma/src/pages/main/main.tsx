import { Box, Link, Button } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onServicesSiteLinkClick: () => void;
  onSitesSiteLinkClick: () => void;
  onVpnBearerLinkClick: () => void;
};

const Main: VoidFunctionComponent<Props> = ({
  onServicesSiteLinkClick,
  onSitesSiteLinkClick,
  onVpnBearerLinkClick,
}) => {
  return (
    <Box padding={6} margin={6} background="white">
      <Box>
        <Button onClick={onServicesSiteLinkClick} as={Link}>
          Services
        </Button>
      </Box>
      <Box>
        <Button onClick={onSitesSiteLinkClick} as={Link}>
          Sites
        </Button>
      </Box>
      <Box>
        <Button onClick={onVpnBearerLinkClick} as={Link}>
          VPN Bearers
        </Button>
      </Box>
    </Box>
  );
};

export default Main;
