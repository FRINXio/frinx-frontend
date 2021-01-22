import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons';
import { Flex, IconButton, Image, MenuButton, Menu, MenuList, MenuItem, Box, Icon, Text } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import UserNav from '../user-nav/user-nav';
import logo from './logo-min.png';
import { getDashboardLinks } from '../../helpers/route.helpers';

type Props = {
  isAuthEnabled: boolean;
};

const Header: FC<Props> = ({ isAuthEnabled, children }) => {
  return (
    <Flex
      height={16}
      alignItems="center"
      px={4}
      boxShadow="md"
      position="relative"
      zIndex="modal"
      background="brand.600"
    >
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
            {getDashboardLinks().map((link) => (
              <MenuItem key={link.path} as={Link} to={link.path}>
                <Icon width={6} height={6} as={FontAwesomeIcon} icon={link.icon} color="brand.700" marginRight={2} />
                <Text fontWeight="bold">{link.label}</Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      <Image src={logo} alt="logo" height={10} />
      <Box marginLeft={8} alignSelf="stretch">
        {children}
      </Box>
      {isAuthEnabled ? <UserNav /> : null}
    </Flex>
  );
};

export default Header;
