import type { IStorage } from "../types";
import type { ExtFns } from "./ext-fns";
import { storage } from '@extend-chrome/storage'

  
export const ChromeExt: ExtFns = {
  StorageGet: async (keys) => storage.local.get(keys),
  StorageSet: (def) => storage.local.set(def),
  ExecScript: chrome.tabs.executeScript,
  TabQuery: chrome.tabs.query,
};
