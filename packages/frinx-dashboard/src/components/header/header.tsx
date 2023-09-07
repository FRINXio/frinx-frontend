import {
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AppMenu from '../app-menu/app-menu';
import UserNav from '../user-nav/user-nav';
import logo from './logo-min.png';

type Props = {
  isAuthEnabled: boolean;
};

const Header: VoidFunctionComponent<Props> = ({ isAuthEnabled }) => {
  return (
    <Flex
      height={16}
      alignItems="center"
      px={4}
      boxShadow="lg"
      position="relative"
      background="white"
      zIndex="overlay"
      borderBottomColor="gray.100"
      borderStyle="solid"
      borderWidth={1}
    >
      <Box marginRight={4}>
        <Menu>
          <MenuButton
            colorScheme="gray"
            size="md"
            as={IconButton}
            icon={<Icon size={30} as={FeatherIcon} icon="menu" />}
          />
          <Portal>
            <MenuList zIndex="tooltip">
              <MenuItem as={Link} to="/">
                <Icon size={20} as={FeatherIcon} icon="grid" color="blue.700" marginRight={2} />
                <Text fontWeight="bold">Dashboard</Text>
              </MenuItem>

              <MenuItem as={Link} to="/workflow-manager">
                <Icon size={20} as={FeatherIcon} icon="layers" color="blue.700" marginRight={2} />
                <Text fontWeight="bold">Workflow manager</Text>
              </MenuItem>
              <MenuItem as={Link} to="/inventory">
                <Icon size={20} as={FeatherIcon} icon="server" color="blue.700" marginRight={2} />
                <Text fontWeight="bold">Device Inventory</Text>
              </MenuItem>
              <MenuItem as={Link} to="/resource-manager">
                <Icon size={20} as={FeatherIcon} icon="hard-drive" color="blue.700" marginRight={2} />
                <Text fontWeight="bold">Resource manager</Text>
              </MenuItem>
              <MenuItem as={Link} to="/gamma">
                <Icon size={20} as={FeatherIcon} icon="hard-drive" color="blue.700" marginRight={2} />
                <Text fontWeight="bold">L3VPN Automation</Text>
              </MenuItem>
              <MenuItem as={Link} to="/device-topology">
                <Icon size={20} as={FeatherIcon} icon="hard-drive" color="blue.700" marginRight={2} />
                <Text fontWeight="bold">Device Topology</Text>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>
      <LinkBox>
        <LinkOverlay as={NavLink} to="/">
          <Image src={logo} alt="logo" height={10} />
          <VisuallyHidden>FRINX</VisuallyHidden>
        </LinkOverlay>
      </LinkBox>
      <Box marginLeft={8} alignSelf="stretch">
        <AppMenu />
      </Box>
      {isAuthEnabled ? <UserNav /> : null}
    </Flex>
  );
};

export default Header;
