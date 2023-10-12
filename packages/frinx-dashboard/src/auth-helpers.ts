import { useEffect, useState } from 'react';

export type UserInfo = {
  user: string;
  email: string;
};
export async function getUserInfo(): Promise<UserInfo> {
  const data = await fetch('/oauth2/userinfo');
  const json = await data.json();

  return json;
}

export type UseUserInfoSuccess = {
  userInfo: UserInfo;
  isLoading: false;
};
export type UseUserInfoLoading = {
  userInfo: null;
  isLoading: true;
};
export type UseUserInfo = UseUserInfoLoading | UseUserInfoSuccess;

export function useUserInfo(): UseUserInfo {
  const [userInfo, setUserInfo] = useState<UseUserInfo>({
    userInfo: null,
    isLoading: true,
  } satisfies UseUserInfoLoading);

  useEffect(() => {
    getUserInfo().then((data) => {
      setUserInfo({
        userInfo: data,
        isLoading: false,
      } satisfies UseUserInfoSuccess);
    });
  }, []);

  return userInfo;
}
