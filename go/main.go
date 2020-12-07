package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"syscall/js"

	"github.com/owulveryck/onnx-go"
	"github.com/owulveryck/onnx-go/backend/x/gorgonnx"
)

func runModel() js.Func {
	retfunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 1 {
			return "Invalid no of arguments passed"
		}
		numbs_in := make([]int, len(args))
		for i := 0; i < len(args); i++ {
			fmt.Printf("non converted %v\n", args[i])
			numbs_in[i] = args[i].Int()
		}
		// inputJSON := args[0].String()
		fmt.Printf("input converted %v\n", numbs_in)
		fmt.Println("AAAAA")

		backend := gorgonnx.NewGraph()
		// Create a model and set the execution backend
		model := onnx.NewModel(backend)

		// read the onnx model
		resp, err := http.Get("/qa_model.onnx")
		if err != nil {
			log.Fatal(err)
		}

		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)

		// Decode it into the model
		err := model.UnmarshalBinary(body)
		if err != nil {
			log.Fatal(err)
		}
		// Set the first input, the number depends of the model
		model.SetInput(0, input)
		err = backend.Run()
		if err != nil {
			log.Fatal(err)
		}
		// Check error
		output, _ := model.GetOutputTensors()
		// write the first output to stdout
		fmt.Println(output[0])
		return numbs_in[0]
	})
	return retfunc
}

func main() {
	fmt.Println("Hello, World from Go!")
	js.Global().Set("runModel", runModel())
	<-make(chan bool)
}
