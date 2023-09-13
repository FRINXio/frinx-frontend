/* eslint-disable no-underscore-dangle */
import { PublicClientApplication } from '@azure/msal-browser';
import EventEmitter from 'eventemitter3';

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

type PublicAppOptions = {
  clientId: string;
  redirectUri: string;
  authority: string;
};

export function createPublicClientApp({ clientId, redirectUri, authority }: PublicAppOptions): PublicClientApplication {
  const authConfig = {
    auth: {
      clientId,
      redirectUri,
      authority,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  };
  return new PublicClientApplication(authConfig);
}
