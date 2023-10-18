import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import FeatherIcon from 'feather-icons-react';
import { useUserInfo } from '../../auth-helpers';

const UserNav: FC = () => {
  const { userInfo, isLoading } = useUserInfo();

  return isLoading ? null : (
    <Box marginLeft="auto">
      <Menu>
        <MenuButton
          colorScheme="blue"
          as={Button}
          size="md"
          rightIcon={<Icon size={30} as={FeatherIcon} icon="chevron-down" />}
        >
          {userInfo?.user}
        </MenuButton>
        <MenuList>
          <Box paddingX={4} paddingY={3}>
            <Heading as="h4" fontSize="sm">
              {userInfo?.email}
            </Heading>
            <Divider marginTop={4} />
          </Box>
          <MenuItem as="a" href="/oauth2/sign_out">
            <Flex
              width={8}
              height={8}
              justifyContent="center"
              alignItems="center"
              borderRadius="md"
              boxShadow="inner"
              background="gray.100"
            >
              <Icon color="gray.700" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </Icon>
            </Flex>
            <Text marginLeft={4}>Logout</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserNav;
