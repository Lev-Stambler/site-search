import GetAnswer from "./components/GetAnswer.svelte";
import { ChromeExt } from "./ext/chrome";
import { defaultStorage, IStorage } from "./types";

const app = new GetAnswer({
  target: document.body,
});
