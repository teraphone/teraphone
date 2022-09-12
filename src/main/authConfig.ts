/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { LogLevel, Configuration } from '@azure/msal-node';
import {
  DataProtectionScope,
  PersistenceCreator,
  PersistenceCachePlugin,
} from '@azure/msal-node-extensions';
import path from 'path';
import { app } from 'electron';

const AAD_ENDPOINT_HOST = 'https://login.microsoftonline.com/';
export const REDIRECT_URI = 'msal9ef60b2f-3246-4390-8e17-a57478e7ec45://auth';

const appDataDir = app.getPath('userData');
const cachePath = path.join(appDataDir, './teraphone-cache.json');
console.log('using cachePath', cachePath);
const persistenceConfiguration = {
  cachePath,
  dataProtectionScope: DataProtectionScope.CurrentUser,
  serviceName: 'teraphone-cache',
  accountName: 'teraphone-cache',
};

export const GetConfig = async (): Promise<Configuration> => {
  try {
    const persistence = await PersistenceCreator.createPersistence(
      persistenceConfiguration
    );
    const msalConfig: Configuration = {
      auth: {
        clientId: '9ef60b2f-3246-4390-8e17-a57478e7ec45',
        authority: `${AAD_ENDPOINT_HOST}common`,
      },
      cache: {
        cachePlugin: new PersistenceCachePlugin(persistence),
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
    return msalConfig;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
