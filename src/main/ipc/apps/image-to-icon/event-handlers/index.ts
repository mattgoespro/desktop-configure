import { IpcMainEvent, IpcMain } from "electron";
import { ImageToIconEventType } from "../events";
import { onConvertImageEvent } from "./convert-image";
import { onSelectFileEvent } from "./select-file";

export const ImageToIconListenerFn = async (event: IpcMainEvent, type: ImageToIconEventType) => {
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

export const imageToIconEventHandler = (ipcMain: IpcMain) => {
  ipcMain.on("image-to-icon", ImageToIconListenerFn);
};
