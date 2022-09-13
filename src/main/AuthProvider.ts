/* eslint-disable no-console */
import {
  PublicClientApplication,
  CryptoProvider,
  AccountInfo,
  SilentFlowRequest,
} from '@azure/msal-node';
import { AuthenticationResult } from '@azure/msal-common';
import { BrowserWindow } from 'electron';
import CustomProtocolListener from './CustomProtocolListener';
import { GetConfig, REDIRECT_URI } from './authConfig';

interface TokenRequest {
  scopes: string[];
  account?: AccountInfo;
  redirectUri: string;
}

class AuthProvider {
  clientApplication!: PublicClientApplication;

  cryptoProvider;

  authCodeUrlParams;

  authCodeRequest;

  pkceCodes: {
    verifier: string;
    challenge: string;
    challengeMethod: string;
  };

  account: AccountInfo | null;

  customFileProtocolName: string;

  isLoggedOut: boolean;

  constructor() {
    /**
     * Initialize a public client application. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-public-client-application.md
     */

    this.account = null;

    // Initialize CryptoProvider instance
    this.cryptoProvider = new CryptoProvider();

    /**
     * To demonstrate best security practices, this Electron sample application makes use of
     * a custom file protocol instead of a regular web (https://) redirect URI in order to
     * handle the redirection step of the authorization flow, as suggested in the OAuth2.0 specification for Native Apps.
     */
    [this.customFileProtocolName] = REDIRECT_URI.split(':');

    const requestScopes = [
      'api://9ef60b2f-3246-4390-8e17-a57478e7ec45/User.Read',
      'User.Read',
      'User.ReadBasic.All',
      'Team.ReadBasic.All',
      'openid',
      'profile',
      'email',
      'offline_access',
    ];

    this.authCodeUrlParams = {
      scopes: requestScopes,
      redirectUri: REDIRECT_URI,
    };

    this.authCodeRequest = {
      scopes: requestScopes,
      redirectUri: REDIRECT_URI,
    };

    this.pkceCodes = {
      challengeMethod: 'S256', // Use SHA256 Algorithm
      verifier: '', // Generate a code verifier for the Auth Code Request first
      challenge: '', // Generate a code challenge from the previously generated code verifier
    };

    this.isLoggedOut = false;
  }

  async initClientApplication() {
    try {
      const config = await GetConfig();
      this.clientApplication = new PublicClientApplication(config);
    } catch (e) {
      console.error(e);
    }
  }

  // USE THESE
  async login() {
    const authResult = await this.getTokenInteractive(this.authCodeUrlParams);
    return this.handleResponse(authResult);
  }

  async auth() {
    const authResponse = await this.getAuth(this.authCodeRequest.scopes);
    return authResponse;
  }

  async authSilent() {
    const authResponse = await this.getAuthSilent(this.authCodeRequest.scopes);
    return authResponse;
  }

  async logout() {
    if (this.account) {
      const cache = this.clientApplication.getTokenCache();
      await cache.removeAccount(this.account);
      this.account = null;
    }
    this.isLoggedOut = true;
  }
  // ^^^ USE THESE

  async getAuth(scopes: string[]) {
    const req = {
      scopes,
      redirectUri: REDIRECT_URI,
    };
    let authResponse: AuthenticationResult | null;
    const account = this.account || (await this.getAccount());
    if (account && !this.isLoggedOut) {
      const silentFlowRequest: SilentFlowRequest = {
        account,
        ...req,
      };
      authResponse = await this.getTokenSilent(silentFlowRequest);
    } else {
      authResponse = await this.getTokenInteractive(req);
    }
    this.isLoggedOut = false;
    this.handleResponse(authResponse);
    return authResponse;
  }

  async getAuthSilent(scopes: string[]) {
    const req = {
      scopes,
      redirectUri: REDIRECT_URI,
    };
    let authResponse: AuthenticationResult | null;
    const account = this.account || (await this.getAccount());
    if (account && !this.isLoggedOut) {
      const silentFlowRequest: SilentFlowRequest = {
        account,
        ...req,
      };
      authResponse = await this.getTokenSilent(silentFlowRequest);
      this.isLoggedOut = false;
      this.handleResponse(authResponse);
      return authResponse;
    }
    return null;
  }

  async getToken(scopes: string[]) {
    const authResponse = await this.getAuth(scopes);
    return authResponse?.accessToken || null;
  }

  async getTokenSilent(tokenRequest: SilentFlowRequest) {
    try {
      return await this.clientApplication.acquireTokenSilent(tokenRequest);
    } catch (error) {
      console.log(
        'Silent token acquisition failed, acquiring token using pop up'
      );
      const authCodeRequest = {
        ...this.authCodeUrlParams,
        ...tokenRequest,
      };
      return await this.getTokenInteractive(authCodeRequest);
    }
  }

  async getTokenInteractive(tokenRequest: TokenRequest) {
    /**
     * Proof Key for Code Exchange (PKCE) Setup
     *
     * MSAL enables PKCE in the Authorization Code Grant Flow by including the codeChallenge and codeChallengeMethod parameters
     * in the request passed into getAuthCodeUrl() API, as well as the codeVerifier parameter in the
     * second leg (acquireTokenByCode() API).
     *
     * MSAL Node provides PKCE Generation tools through the CryptoProvider class, which exposes
     * the generatePkceCodes() asynchronous API. As illustrated in the example below, the verifier
     * and challenge values should be generated previous to the authorization flow initiation.
     *
     * For details on PKCE code generation logic, consult the
     * PKCE specification https://tools.ietf.org/html/rfc7636#section-4
     */
    console.log('getTokenInteractive', 'tokenRequest', tokenRequest);
    const { verifier, challenge } =
      await this.cryptoProvider.generatePkceCodes();
    this.pkceCodes.verifier = verifier;
    this.pkceCodes.challenge = challenge;

    // Add PKCE params to Auth Code URL request
    const authCodeUrlParams = {
      ...this.authCodeUrlParams,
      scopes: tokenRequest.scopes,
      codeChallenge: this.pkceCodes.challenge, // PKCE Code Challenge
      codeChallengeMethod: this.pkceCodes.challengeMethod, // PKCE Code Challenge Method
    };
    const params = this.isLoggedOut
      ? { ...authCodeUrlParams, prompt: 'select_account' }
      : authCodeUrlParams;

    // Create a popup window for interactive authentication
    const popupWindow = new BrowserWindow({
      autoHideMenuBar: true,
      height: 575,
      minHeight: 300,
      title: 'Sign in to your account',
      width: 470,
    });
    // Set up custom file protocol to listen for redirect and get auth code
    const authCodeListener = new CustomProtocolListener(
      this.customFileProtocolName
    );

    try {
      const popupPromise = new Promise((_resolve, reject) => {
        popupWindow.on('closed', reject);
      });
      const authCodeListenerPromise = authCodeListener.start();

      const authCodeUrl = await this.clientApplication.getAuthCodeUrl(params);
      popupWindow.loadURL(authCodeUrl);

      const authCode = await Promise.race([
        authCodeListenerPromise, // Resolves with MS auth code
        popupPromise, // Rejects if user closes window
      ]);
      authCodeListener.close();

      // Use Authorization Code and PKCE Code verifier to make token request
      const authResult = await this.clientApplication.acquireTokenByCode({
        ...this.authCodeRequest,
        code: authCode as string,
        codeVerifier: verifier,
      });

      popupWindow.close();
      return authResult;
    } catch (error) {
      authCodeListener.close();
      popupWindow.close();
      throw error;
    }
  }

  /**
   * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
   * @param response
   */
  async handleResponse(response: AuthenticationResult | null) {
    if (response !== null) {
      this.account = response.account;
    } else {
      this.account = await this.getAccount();
    }

    return this.account;
  }

  /**
   * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  async getAccount() {
    // need to call getAccount here?
    const cache = this.clientApplication.getTokenCache();
    const currentAccounts = await cache.getAllAccounts();

    if (currentAccounts === null) {
      console.log('No accounts detected');
      return null;
    }

    if (currentAccounts.length > 1) {
      // Add choose account code here
      console.log(
        'Multiple accounts detected, need to add choose account code.'
      );
      return currentAccounts[0];
    }
    if (currentAccounts.length === 1) {
      return currentAccounts[0];
    }
    return null;
  }
}

export default AuthProvider;
