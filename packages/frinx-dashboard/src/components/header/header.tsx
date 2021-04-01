import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import {
  Flex,
  IconButton,
  Image,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Box,
  Icon,
  Text,
  Portal,
  LinkBox,
  LinkOverlay,
  VisuallyHidden,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import UserNav from '../user-nav/user-nav';
import logo from './logo-min.png';
import AppMenu from '../app-menu/app-menu';
import { ServiceKey } from '../../types';

type Props = {
  isAuthEnabled: boolean;
  enabledServices: Map<ServiceKey, boolean>;
  homePath: string;
};

const Header: FC<Props> = ({ isAuthEnabled, enabledServices, homePath }) => {
  return (
    <Flex height={16} alignItems="center" px={4} boxShadow="md" position="relative" background="brand.600">
      <Box marginRight={4}>
        <Menu>
          <MenuButton colorScheme="brand" size="md" as={IconButton} icon={<HamburgerIcon />} />
          <Portal>
            <MenuList zIndex="tooltip">
              <MenuItem as={Link} to="/">
                <Icon size={20} as={FeatherIcon} icon="grid" color="brand.700" marginRight={2} />
                <Text fontWeight="bold">Dashboard</Text>
              </MenuItem>
              {enabledServices.get('uniflow_enabled') && (
                <MenuItem as={Link} to="/uniflow">
                  <Icon size={20} as={FeatherIcon} icon="layers" color="brand.700" marginRight={2} />
                  <Text fontWeight="bold">UniFlow</Text>
                </MenuItem>
              )}
              {enabledServices.get('uniconfig_enabled') && (
                <MenuItem as={Link} to="/uniconfig">
                  <Icon size={20} as={FeatherIcon} icon="server" color="brand.700" marginRight={2} />
                  <Text fontWeight="bold">UniConfig</Text>
                </MenuItem>
              )}
              {enabledServices.get('uniresource_enabled') && (
                <MenuItem as={Link} to="/uniresource">
                  <Icon size={20} as={FeatherIcon} icon="hard-drive" color="brand.700" marginRight={2} />
                  <Text fontWeight="bold">UniResource</Text>
                </MenuItem>
              )}
            </MenuList>
          </Portal>
        </Menu>
      </Box>
      <LinkBox>
        <LinkOverlay as={NavLink} to={homePath}>
          <Image src={logo} alt="logo" height={10} />
          <VisuallyHidden>FRINX</VisuallyHidden>
        </LinkOverlay>
      </LinkBox>
      <Box marginLeft={8} alignSelf="stretch">
        <AppMenu enabledServices={enabledServices} />
      </Box>
      {isAuthEnabled ? <UserNav /> : null}
    </Flex>
  );
};

export default Header;
