// require("./wasm_exec.js")
const globalAny: any = global;

const go = new globalAny.Go();
WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
  }
);
export function polling() {
}
// (async () => {
//     const response = await fetch('./main.wasm');
//     const buffer = await response.arrayBuffer();
//     const module = await WebAssembly.compile(buffer);
//     const instance = await WebAssembly.instantiate(module);
//     // const result = instance.exports.fibonacci(42);
//     // console.log(result);
//   })();
polling();
