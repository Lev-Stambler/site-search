const js = import("../../node_modules/encoding-wasm/encoding_wasm");
js.then((X) => {
  X.greet("AAA");
});
// import * as X from '../../rust/encoding-wasm/pkg'
export async function tokenizerSetup() {
  alert("a");
}

export async function encode(text: string) {
  // const encoded = await tokenizer.encode(text);
  // return encoded.wordIndexes;
}
