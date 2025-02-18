import { IpcMainEvent } from "electron";
import { Events } from "renderer/app/communication/image-to-icon/events";
import { onConvertImageEvent } from "./convert-image";
import { onSelectFileEvent } from "./select-file";

const ImageToIconListenerFn = async (event: IpcMainEvent, type: Events) => {
  switch (type.event) {
    case "select-file":
      onSelectFileEvent(event);
      return;
    case "convert-image":
      onConvertImageEvent(event, type);
      return;
    default:
      return;
  }
};

export const imageToIconEventHandler = (ipcMain: Electron.CrossProcessExports.IpcMain) => {
  ipcMain.on("image-to-icon", ImageToIconListenerFn);
};
