/* eslint-disable no-underscore-dangle */
import { PublicClientApplication } from '@azure/msal-browser';
import EventEmitter from 'eventemitter3';

const LS_TOKEN_KEY = 'id_token';

export type UnauthorizedEventKey = 'UNAUTHORIZED';

export class AuthContext {
  public eventEmitter: EventEmitter<UnauthorizedEventKey> = new EventEmitter();

  private authToken: string | null = localStorage.getItem(LS_TOKEN_KEY);

  static isAuthEnabled(): boolean {
    return window.__CONFIG__.auth_enabled;
  }

  public isAuthorized(): boolean {
    return AuthContext.isAuthEnabled() && this.getAuthToken() != null;
  }

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

  public emitUnauthorized(): void {
    this.eventEmitter.emit('UNAUTHORIZED');
  }
}

export const authContext = new AuthContext();

export function createPublicClientApp(): PublicClientApplication {
  const authConfig = {
    auth: {
      clientId: window.__CONFIG__.auth_client_id,
      redirectUri: window.__CONFIG__.auth_redirect_url,
      authority: window.__CONFIG__.msal_authority,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  };
  return new PublicClientApplication(authConfig);
}
