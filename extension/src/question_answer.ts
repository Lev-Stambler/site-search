import NewTabRes from "./components/QuestionAnswers.svelte";
import { ChromeExt } from "./ext/chrome";
import { defaultStorage, IStorage } from "./types";

const app = new NewTabRes({
  target: document.body,
  props: {},
});
