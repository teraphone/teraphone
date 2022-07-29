/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { LogLevel, Configuration } from '@azure/msal-node';

const AAD_ENDPOINT_HOST = 'https://login.microsoftonline.com/';
export const REDIRECT_URI = 'msal9ef60b2f-3246-4390-8e17-a57478e7ec45://auth';

export const msalConfig: Configuration = {
  auth: {
    clientId: '9ef60b2f-3246-4390-8e17-a57478e7ec45',
    authority: `${AAD_ENDPOINT_HOST}common`,
  },
  system: {
    loggerOptions: {
      loggerCallback(_loglevel, message, _containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
};

const GRAPH_ENDPOINT_HOST = 'https://graph.microsoft.com/'; // include the trailing slash

export const protectedResources = {
  graphMe: {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me`,
    scopes: ['User.Read'],
  },
  graphMessages: {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me/messages`,
    scopes: ['Mail.Read'],
  },
};
