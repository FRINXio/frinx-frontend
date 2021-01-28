import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripHorizontal, faCogs, faLaptopCode } from '@fortawesome/free-solid-svg-icons';
import { Flex, IconButton, Image, MenuButton, Menu, MenuList, MenuItem, Box, Icon, Text } from '@chakra-ui/react';
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
          <MenuList>
            <MenuItem as={Link} to="/">
              <Icon
                width={6}
                height={6}
                as={FontAwesomeIcon}
                icon={faGripHorizontal}
                color="brand.700"
                marginRight={2}
              />
              <Text fontWeight="bold">Dashboard</Text>
            </MenuItem>
            {enabledServices.get('uniflow_enabled') && (
              <MenuItem as={Link} to="/uniflow">
                <Icon width={6} height={6} as={FontAwesomeIcon} icon={faCogs} color="brand.700" marginRight={2} />
                <Text fontWeight="bold">Uniflow</Text>
              </MenuItem>
            )}
            {enabledServices.get('uniconfig_enabled') && (
              <MenuItem as={Link} to="/uniconfig">
                <Icon width={6} height={6} as={FontAwesomeIcon} icon={faLaptopCode} color="brand.700" marginRight={2} />
                <Text fontWeight="bold">Uniconfig</Text>
              </MenuItem>
            )}
          </MenuList>
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
