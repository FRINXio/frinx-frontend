import React, { FC } from 'react';
import { Flex, IconButton, Image, MenuButton, Menu, MenuList, MenuItem, Box } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import UserNav from '../user-nav/user-nav';
import logo from './logo-min.png';

const Header: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
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
            <MenuItem>Uniflow</MenuItem>
            <MenuItem>Resource manager</MenuItem>
            <MenuItem>Uniconfig</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Image src={logo} alt="logo" height={10} />
      {isAuthEnabled ? <UserNav /> : null}
    </Flex>
  );
};

export default Header;
