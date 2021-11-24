/* eslint-disable no-underscore-dangle */
import { LogLevel } from '@azure/msal-common';
import { PublicClientApplication, Configuration } from '@azure/msal-browser';

const LS_TOKEN_KEY = 'id_token';

// Set ID token (JWT) to cookie
export function setTokenCookie(token: string): void {
  document.cookie = `BearerToken=${token}; SameSite=None; Secure; path=/`;
}

export function removeTokenCookie(): void {
  document.cookie = `BearerToken=;  expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function setAuthToken(token: string) {
  localStorage.setItem(LS_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(LS_TOKEN_KEY);
}

export function isAuthEnabled(): boolean {
  return window.__CONFIG__.auth_enabled;
}

const authConfig: Configuration = {
  auth: {
    clientId: window.__CONFIG__.auth_client_id || '',
    redirectUri: window.__CONFIG__.auth_redirect_url || 'http://localhost:3000/',
    // authority: 'https://login.microsoftonline.com/8379e38f-b9ed-4168-8a1b-69be764c9750'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        /* eslint-disable no-console */
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          case LogLevel.Info:
          default:
            console.info(message);
        }
        /* eslint-enable */
      },
      // Do not log personal and org data
      piiLoggingEnabled: false,
    },
  },
};

export function createPublicClientApp(): PublicClientApplication {
  return new PublicClientApplication(authConfig);
}
