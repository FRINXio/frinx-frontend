/* eslint-disable no-underscore-dangle */
import { AccountInfo, InteractionStatus, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import EventEmitter from 'eventemitter3';

const LS_TOKEN_KEY = 'id_token';

export type UnauthorizedEventKey = 'UNAUTHORIZED';
export type EventKeys = 'UNAUTHORIZED' | 'FORBIDDEN' | 'ACCESS_REJECTED';

export class AuthContext {
  public eventEmitter: EventEmitter<EventKeys> = new EventEmitter();

  private authToken: string | null = localStorage.getItem(LS_TOKEN_KEY);

  static isAuthEnabled(): boolean {
    return window.__CONFIG__.isAuthEnabled;
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

  public emit(event: EventKeys): void {
    this.eventEmitter.emit(event);
  }
}

export const authContext = new AuthContext();

export function createPublicClientApp(): PublicClientApplication {
  const authConfig = {
    auth: {
      clientId: window.__CONFIG__.authClientId,
      redirectUri: window.__CONFIG__.authRedirectURL,
      authority: window.__CONFIG__.MSALAuthority,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  };
  return new PublicClientApplication(authConfig);
}

export async function refreshToken(
  inProgress: InteractionStatus,
  accounts: AccountInfo[],
  instance: IPublicClientApplication,
): Promise<string | null> {
  if (inProgress === 'none' && accounts.length > 0) {
    try {
      const authResult = await instance.acquireTokenSilent({
        account: accounts[0],
        scopes: ['User.Read'],
      });

      return authResult.idToken;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('could not get refreshed token', e);
    }
  }

  return null;
}
