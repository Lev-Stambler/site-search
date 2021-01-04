import { defaultStorage, IStorage } from "./types";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(defaultStorage as IStorage, ({ bodies }: IStorage) => {
    });
});
