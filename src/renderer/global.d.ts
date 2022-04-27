export type SerializedDesktopCapturerSource = {
  id: string;
  name: string;
  thumbnailDataURL: string;
  display_id: string;
  appIconDataURL: string | null;
};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        queryScreens(options: {
          types: string[]; // "screen" | "window"
          thumbnailSize?: {
            width: number;
            height: number;
          };
          fetchWindowIcons?: boolean;
        }): Promise<SerializedDesktopCapturerSource[]>;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}
