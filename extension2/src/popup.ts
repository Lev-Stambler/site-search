import * as moment from "moment";
import * as $ from "jquery";

let count = 0;

const globalAny: any = global;

const go = new globalAny.Go();
WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
  }
);

// https://golangbot.com/webassembly-using-go/
document.querySelector("#countUp").addEventListener("click", async (e) => {
  globalAny.runModel([1, 2, 3, 4])
});
