/* eslint-disable @typescript-eslint/no-unused-vars */
import { protocol } from 'electron';

class CustomProtocolListener {
  hostName;
  /**
   * Constructor
   * @param hostName - A string that represents the host name that should be listened on (i.e. 'msal' or '127.0.0.1')
   */

  constructor(hostName: string) {
    this.hostName = hostName; // A string that represents the host name that should be listened on (i.e. 'msal' or '127.0.0.1')
  }

  get host() {
    return this.hostName;
  }

  /**
   * Registers a custom string protocol on which the library will
   * listen for Auth Code response.
   */
  start() {
    const codePromise = new Promise((resolve, reject) => {
      protocol.registerStringProtocol(this.host, (req, _callback) => {
        const requestUrl = new URL(req.url);
        const authCode = requestUrl.searchParams.get('code');
        if (authCode) {
          resolve(authCode);
        } else {
          protocol.unregisterProtocol(this.host);
          reject(new Error('No code found in URL'));
        }
      });
    });

    return codePromise;
  }

  /**
   * Unregisters a custom string protocol to stop listening for Auth Code response.
   */
  close() {
    protocol.unregisterProtocol(this.host);
  }
}

export default CustomProtocolListener;
