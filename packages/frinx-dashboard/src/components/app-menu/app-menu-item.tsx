import { Link } from '@chakra-ui/react';
import React, { ElementType, FC } from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  to?: string;
  as?: ElementType;
};

const AppMenuItem: FC<Props> = ({ to, children, as = NavLink }) => {
  return (
    <Link
      to={to}
      as={as}
      color="blackAlpha.700"
      fontWeight={600}
      display="flex"
      alignItems="center"
      paddingX={4}
      borderBottomWidth={4}
      borderColor="transparent"
      borderStyle="solid"
      _hover={{
        borderColor: 'blue.200',
        color: 'blackAlpha.900',
      }}
      _active={{
        background: 'blackAlpha.100',
      }}
    >
      {children}
    </Link>
  );
};

export default AppMenuItem;
