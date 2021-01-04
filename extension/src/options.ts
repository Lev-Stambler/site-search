import Options from "./components/Options.svelte";
import { defaultStorage, IStorage } from "./types";

function restoreOptions() {
  const app = new Options({
    target: document.body,
    props: {},
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
