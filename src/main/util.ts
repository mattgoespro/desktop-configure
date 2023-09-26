import path from "path";
import { URL } from "url";

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}

export function inDevelopmentMode() {
  return process.env.NODE_ENV === "development";
}

export function inProductionMode() {
  return process.env.NODE_ENV === "production";
}
