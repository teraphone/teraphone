/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare let window: Window;

export interface IElectron {
  ipcRenderer: {
    myPing(): void;
    on(channel: any, func: any): void;
    once(channel: any, func: any): void;
  };
}

declare global {
  interface Window {
    electron: IElectron;
    process: any;
    require: any;
  }
}
export { };
