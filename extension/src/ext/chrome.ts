import type { IStorage } from "../types";
import type { ExtFns } from "./ext-fns";

export const ChromeExt: ExtFns = {
  StorageSyncGet: (def, cbk) => chrome.storage.sync.get(def, cbk),
  StorageSyncSet: (def, cbk) => chrome.storage.sync.set(def, cbk),
  ExecScript: chrome.tabs.executeScript,
  TabQuery: chrome.tabs.query,
};
