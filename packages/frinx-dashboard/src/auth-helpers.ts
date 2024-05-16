import EventEmitter from 'eventemitter3';
import { useEffect, useState } from 'react';

const LS_TOKEN_KEY = 'id_token';

export type UnauthorizedEventKey = 'UNAUTHORIZED';
export type EventKeys = 'UNAUTHORIZED' | 'FORBIDDEN' | 'ACCESS_REJECTED';

export class AuthContext {
  public eventEmitter: EventEmitter<EventKeys> = new EventEmitter();

  private authToken: string | null = localStorage.getItem(LS_TOKEN_KEY);

  public setAuthToken(authToken: string): void {
    localStorage.setItem(LS_TOKEN_KEY, authToken);
    this.authToken = authToken;
  }

  public deleteAuthToken(): void {
    localStorage.removeItem(LS_TOKEN_KEY);
    this.authToken = null;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public emit(event: EventKeys): void {
    this.eventEmitter.emit(event);
  }
}

export const authContext = new AuthContext();

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
