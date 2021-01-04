import GetAnswer from "./components/GetAnswer.svelte";
import { ChromeExt } from "./ext/chrome";
import { defaultStorage, IStorage } from "./types";

ChromeExt.StorageSyncGet(defaultStorage as IStorage, (stored) => {
  const app = new GetAnswer({
    target: document.body,
  });
});
