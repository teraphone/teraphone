import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
} from '@microsoft/microsoft-graph-client';

export const b64toBlob = async (
  b64Data: string,
  contentType = 'image/png',
  sliceSize = 512
): Promise<Blob> => {
  const byteCharacters: string = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
};

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
