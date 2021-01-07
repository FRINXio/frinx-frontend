import React, { useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { setTokenCookie, removeTokenCookie } from "../auth-helpers";
import "./Header.css";

const UserNav = () => {
  const { instance, accounts, inProgress } = useMsal();
  useEffect(() => {
    if (inProgress === "none" && accounts.length > 0) {
        //TODO commented out, does NOT compile
      // const authResultPromise = instance.acquireTokenSilent({
      //   account: accounts[0],
      //   scopes: ["User.Read"],
      // });
      //
      // authResultPromise.then((value) => {
      //   // Pushing JWT token to cookie (msal stores it in localStorage) in order to pass the token to api-gateway
      //   //  api gateway needs to make sure the token is still valid
      //   // TODO now the token is in localStorage and also in cookie ... is that OK ?
      //   setTokenCookie(value.idToken);
      // });
    }
    // there seems to be a bug when adding `accounts` to this deps array (it makes it run infinitely)
    // we will not add them for now
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProgress, instance]);

  return (
    <div className="user-nav">
      <UnauthenticatedTemplate>
        <Button
          onClick={() => {
            instance.loginPopup({
              scopes: ["openid", "profile", "User.Read.All"],
            });
          }}
        >
          Login
        </Button>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        {
          // TODO: fix types (it seems like a bug in type definitions in the library)
        }
        {(authProps: {
          accounts: { username: string; localAccountId: string }[];
        }) => {
          const [currentAccount] = authProps.accounts;
          return (
            <DropdownButton title={currentAccount.username} alignRight>
              <Dropdown.Item
                as="a"
                href={`https://myaccount.microsoft.com/?client_id=${currentAccount.localAccountId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  instance
                    .logout()
                    .catch((e) => {
                      console.error(e);
                    })
                    .finally(() => {
                      removeTokenCookie();
                    });
                }}
              >
                Logout
              </Dropdown.Item>
            </DropdownButton>
          );
        }}
      </AuthenticatedTemplate>
    </div>
  );
};

export default UserNav;
