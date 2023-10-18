import { useEffect, useState } from 'react';

export type UserInfo = {
  user: string;
  email: string;
};
export async function getUserInfo(): Promise<UserInfo | null> {
  try {
    const data = await fetch('/oauth2/userinfo');
    const json = await data.json();
    return json;
  } catch {
    return null;
  }
}

export type UseUserInfoSuccess = {
  userInfo: UserInfo;
  isLoading: false;
  hasError: false;
};
export type UseUserInfoLoading = {
  userInfo: null;
  isLoading: true;
  hasError: false;
};
export type UserInfoError = {
  userInfo: null;
  isLoading: false;
  hasError: true;
};
export type UseUserInfo = UseUserInfoLoading | UseUserInfoSuccess | UserInfoError;

export function useUserInfo(): UseUserInfo {
  const [userInfo, setUserInfo] = useState<UseUserInfo>({
    userInfo: null,
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    getUserInfo().then((data) => {
      if (data != null) {
        return setUserInfo({
          userInfo: data,
          isLoading: false,
          hasError: false,
        });
      }
      return setUserInfo({
        userInfo: null,
        isLoading: false,
        hasError: true,
      });
    });
  }, []);

  return userInfo;
}
