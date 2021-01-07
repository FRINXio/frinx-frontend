import { LogLevel } from "@azure/msal-common";
import { PublicClientApplication, Configuration } from "@azure/msal-browser";

// Set ID token (JWT) to cookie
export function setTokenCookie(token: string): void {
  document.cookie = `BearerToken=${token}; SameSite=None; Secure; path=/`;
}

export function removeTokenCookie(): void {
  document.cookie = `BearerToken=;  expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function isAuthEnabled(): boolean {
  return process.env.REACT_APP_AUTH_ENABLED === "true";
}

const authConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AD_CLIENT_ID || "",
    redirectUri:
      process.env.REACT_APP_AD_REDIRECT_URL || "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
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
      },
      // Do not log personal and org data
      piiLoggingEnabled: false,
    },
  },
};

export function createPublicClientApp(): PublicClientApplication {
  return new PublicClientApplication(authConfig);
}
