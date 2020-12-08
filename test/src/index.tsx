import ReactDOM from "react-dom";
import React from "react";
import * as tractjs from "tractjs";
import * as torchjs from "@arition/torch-js";

import App from "./components/App";

(async () => {
  // const model = new torchjs.ScriptModule('/trained-5k.pt')
  // const inputA = torchjs.tensor((new Array(512).fill(110)))
  // const res = await model.forward(inputA)
  const x: tractjs.DataType = "float32"
  const model = await tractjs.load("saved_model.pb", 
  {
    format: "tensorflow",
    inputFacts: {
      0: ["float64", [1, 512]],
    },
    // optimize: false,
    // outputs: ["is_same"]
  });
  console.log("AAAA");
  model
    .predict(
      [new tractjs.Tensor(new Int32Array(new Array(512).fill(110)), [1, 512])],
      { s: 512 }
    )
    .then((x) => {
      console.log(x);
      model
        .predict(
          [
            new tractjs.Tensor(new Int32Array(new Array(512).fill(110)), [
              1,
              512,
            ]),
          ],
          { s: 512 }
        )
        .then((x) => {
          console.log(x);
        });
    });
  console.log("AAAAAAA");
})();
ReactDOM.render(<App name="World" />, document.querySelector("#container"));

if (module && module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler((status) => {
    if (status === "prepare") console.clear();
  });
}
