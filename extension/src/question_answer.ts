import NewTabRes from "./components/QuestionAnswers.svelte";
import { ChromeExt } from "./ext/chrome";
import { defaultStorage, IStorage } from "./types";

ChromeExt.StorageSyncGet(defaultStorage as IStorage, ({bodies}: IStorage) => {
  const app = new NewTabRes({
    target: document.body,
    props: {
      bodies
    }
  });
});
