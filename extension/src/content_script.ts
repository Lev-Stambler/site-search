import { defaultStorage, IStorage } from "./types";

chrome.storage.sync.get(defaultStorage as IStorage, (defaultStorage: IStorage) => {
});
