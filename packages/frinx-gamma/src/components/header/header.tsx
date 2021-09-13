import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, IconButton, Image, MenuButton, Menu, Box, LinkBox, LinkOverlay, VisuallyHidden } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import UserNav from '../user-nav/user-nav';
import logo from './logo-min.png';

type Props = {
  isAuthEnabled: boolean;
};

const Header: FC<Props> = ({ isAuthEnabled }) => {
  return (
    <Flex height={16} alignItems="center" px={4} boxShadow="md" position="relative" background="brand.600">
      <Box marginRight={4}>
        <Menu>
          <MenuButton colorScheme="brand" size="md" as={IconButton} icon={<HamburgerIcon />} />
        </Menu>
      </Box>
      <LinkBox>
        <LinkOverlay as={NavLink} to="/">
          <Image src={logo} alt="logo" height={10} />
          <VisuallyHidden>FRINX</VisuallyHidden>
        </LinkOverlay>
      </LinkBox>
      {isAuthEnabled ? <UserNav /> : null}
    </Flex>
  );
};

export default Header;
