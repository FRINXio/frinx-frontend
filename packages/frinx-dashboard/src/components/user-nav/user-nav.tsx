import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
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
import { authContext } from '../../auth-helpers';
import useAuth from '../../use-auth';
import FeatherIcon from 'feather-icons-react';

const UserNav: FC = () => {
  const { inProgress, login, logout } = useAuth();

  return (
    <Box marginLeft="auto">
      <UnauthenticatedTemplate>
        <Button colorScheme="brand" isLoading={inProgress === 'login'} onClick={login}>
          Login
        </Button>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        {
          // TODO: fix types (it seems like a bug in type definitions in the library)
        }
        {(authProps: { accounts: { username: string; localAccountId: string; name: string }[] }) => {
          const [currentAccount] = authProps.accounts;
          return (
            <Menu>
              <MenuButton
                colorScheme="brand"
                as={Button}
                size="md"
                rightIcon={<Icon size={30} as={FeatherIcon} icon="chevron-down" />}
              >
                {currentAccount.name}
              </MenuButton>
              <MenuList>
                <Box paddingX={4} paddingY={3}>
                  <Heading as="h4" fontSize="sm">
                    {currentAccount.username}
                  </Heading>
                  <Divider marginTop={4} />
                </Box>
                <MenuItem
                  as="a"
                  href={`https://myaccount.microsoft.com/?client_id=${currentAccount.localAccountId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="flex"
                  alignItems="center"
                >
                  <Flex
                    width={8}
                    height={8}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="md"
                    boxShadow="inner"
                    background="gray.200"
                  >
                    <Icon color="gray.800">
                      <path fill="currentColor" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle fill="currentColor" cx="12" cy="7" r="4" />
                    </Icon>
                  </Flex>
                  <Text marginLeft={4}>Profile</Text>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    authContext.deleteAuthToken();
                    logout();
                  }}
                >
                  <Flex
                    width={8}
                    height={8}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="md"
                    boxShadow="inner"
                    background="gray.100"
                  >
                    <Icon
                      color="gray.700"
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </Icon>
                  </Flex>
                  <Text marginLeft={4}>Logout</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          );
        }}
      </AuthenticatedTemplate>
    </Box>
  );
};

export default UserNav;
