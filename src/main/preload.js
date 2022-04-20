/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
const { contextBridge, ipcRenderer, nativeImage } = require('electron');

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
      // const sources = serializedSources.map((source) => {
      //   const { id, name, thumbnailDataURL, display_id, appIconDataURL } =
      //     source;
      //   console.log('id', id, 'thumbnailDataURL', thumbnailDataURL);
      //   const thumbnail = nativeImage.createFromDataURL(thumbnailDataURL);
      //   const appIcon = appIconDataURL
      //     ? nativeImage.createFromDataURL(appIconDataURL)
      //     : null;
      //   return { id, name, thumbnail, display_id, appIcon };
      // });
      // return Promise.all(sources);
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
