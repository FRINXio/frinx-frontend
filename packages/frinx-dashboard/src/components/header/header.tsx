import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FeatherIcon from 'feather-icons-react';
import { faGripHorizontal, faCogs, faLaptopCode } from '@fortawesome/free-solid-svg-icons';
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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import UserNav from '../user-nav/user-nav';
import logo from './logo-min.png';
import AppMenu from '../app-menu/app-menu';
import { ServiceKey } from '../../types';

type Props = {
  isAuthEnabled: boolean;
  enabledServices: Map<ServiceKey, boolean>;
};

const Header: FC<Props> = ({ isAuthEnabled, enabledServices }) => {
  return (
    <Flex height={16} alignItems="center" px={4} boxShadow="md" position="relative" background="brand.600">
      <Box marginRight={4}>
        <Menu>
          <MenuButton colorScheme="brand" size="md" as={IconButton} icon={<HamburgerIcon />} />
          <Portal>
            <MenuList>
              <MenuItem as={Link} to="/">
                <Icon size={20} as={FeatherIcon} icon="grid" color="brand.700" marginRight={2} />
                <Text fontWeight="bold">Dashboard</Text>
              </MenuItem>
              {enabledServices.get('uniflow_enabled') && (
                <MenuItem as={Link} to="/uniflow">
                  <Icon size={20} as={FeatherIcon} icon="layers" color="brand.700" marginRight={2} />
                  <Text fontWeight="bold">Uniflow</Text>
                </MenuItem>
              )}
              {enabledServices.get('uniconfig_enabled') && (
                <MenuItem as={Link} to="/uniconfig">
                  <Icon size={20} as={FeatherIcon} icon="server" color="brand.700" marginRight={2} />
                  <Text fontWeight="bold">Uniconfig</Text>
                </MenuItem>
              )}
              {enabledServices.get('uniresource_enabled') && (
                <MenuItem as={Link} to="/uniresource">
                  <Icon size={20} as={FeatherIcon} icon="package" color="brand.700" marginRight={2} />
                  <Text fontWeight="bold">Uniresource</Text>
                </MenuItem>
              )}
            </MenuList>
          </Portal>
        </Menu>
      </Box>
      <Image src={logo} alt="logo" height={10} />
      <Box marginLeft={8} alignSelf="stretch">
        <AppMenu enabledServices={enabledServices} />
      </Box>
      {isAuthEnabled ? <UserNav /> : null}
    </Flex>
  );
};

export default Header;
