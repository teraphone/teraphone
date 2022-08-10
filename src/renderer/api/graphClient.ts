import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
} from '@microsoft/microsoft-graph-client';

class GraphAuthProvider implements AuthenticationProvider {
  scopes = ['User.Read'];

  constructor(scopes?: string[]) {
    if (scopes) {
      this.scopes = scopes;
    }
  }

  public async getAccessToken(
    authenticationProviderOptions?: AuthenticationProviderOptions
  ): Promise<string> {
    if (authenticationProviderOptions?.scopes) {
      this.scopes = authenticationProviderOptions.scopes;
      // ^^^ this.scopes is never used
    }
    // todo: add scopes support auth()
    const authResult = await window.electron.ipcRenderer.auth();
    try {
      if (authResult) {
        return authResult.accessToken;
      }
      throw new Error('Auth result is null');
    } catch (err: unknown) {
      throw new Error('Error getting access token');
    }
  }
}

const authProvider = new GraphAuthProvider();
const msGraphClient = Client.initWithMiddleware({
  debugLogging: true,
  authProvider,
});

export default msGraphClient;
