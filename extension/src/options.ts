import Options from "./components/Options.svelte";
import { defaultStorage, IStorage } from "./types";

function restoreOptions() {
    chrome.storage.sync.get(defaultStorage as IStorage, (defaultStorage: IStorage) => {
        const app = new Options({
            target: document.body,
            props: {  },
        });
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
