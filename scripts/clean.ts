import fs from "fs";
import { rimrafSync } from "rimraf";
import webpackPaths from "../webpack/paths";

const foldersToRemove = [webpackPaths.distPath, webpackPaths.buildPath, webpackPaths.dllPath];

foldersToRemove.forEach((folder) => {
  if (fs.existsSync(folder)) rimrafSync(folder);
});
