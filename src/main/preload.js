/* eslint-disable no-console */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer
        .invoke('ipc-example', 'ping')
        .then((result) => {
          console.log(result);
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async queryScreens(options) {
      const serializedSources = await ipcRenderer.invoke(
        'QUERY-SCREENS',
        options
      );
      return serializedSources;
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
