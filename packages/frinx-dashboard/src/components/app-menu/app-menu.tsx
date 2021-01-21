import React, { FC } from 'react';
import { Flex, Link } from '@chakra-ui/react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { MenuLink } from '../../helpers/route.helpers';

type Props = {
  menuLinks: MenuLink[];
};

const AppMenu: FC<Props> = ({ menuLinks }) => {
  const { url } = useRouteMatch();

  return (
    <Flex alignItems="stretch" height="100%">
      {menuLinks.map((link) => (
        <Link
          color="brand.50"
          display="flex"
          alignItems="center"
          paddingX={4}
          borderBottomWidth={4}
          borderColor="transparent"
          borderStyle="solid"
          _hover={{
            borderColor: 'brand.50',
          }}
          _active={{
            background: 'brand.800',
          }}
          as={NavLink}
          key={link.label}
          to={`${url}${link.path}`}
          exact
        >
          {link.label}
        </Link>
      ))}
    </Flex>
  );
};

export default AppMenu;
