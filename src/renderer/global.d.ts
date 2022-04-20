/* eslint-disable prettier/prettier */

import { DesktopCapturerSource } from "electron";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare let window: Window;

export type SerializedDesktopCapturerSource = {
  id: string;
  name: string;
  thumbnailDataURL: string;
  display_id: string;
  appIconDataURL: string | null;
}

export interface IElectron {
  ipcRenderer: {
    myPing(): void;
    queryScreens(options: {
      types: string[]; // "screen" | "window"
      thumbnailSize?: {
        width: number;
        height: number;
      },
      fetchWindowIcons?: boolean;
    }): Promise<SerializedDesktopCapturerSource[]>;
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
