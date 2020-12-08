package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
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
		fmt.Println("AAAAA")
		var wg sync.WaitGroup
		wg.Add(1)
		fmt.Println("BBBB")
		go func() {
			resp, err := http.Get("/qa_model.onnx")
			if err != nil {
				fmt.Println("Error with http get\n")
				log.Fatal(err)
			}

			fmt.Println("AAAAA")
			defer resp.Body.Close()
			body, err := ioutil.ReadAll(resp.Body)
			fmt.Println("AAAAA")

			// Decode it into the model
			err = model.UnmarshalBinary(body)
			if err != nil {
				fmt.Println("model marshal error")
				log.Fatal(err)
			}
			// Set the first input, the number depends of the model
			// s := make([]int64, 512)
			// for i := range s {
			// 	s[i] = 112
			// }
			// tp := &ir.TensorProto{
			// 	Dims:      []int64{1, 512},
			// 	DataType:  ir.TensorProto_DataType_value["INT64"],
			// 	FloatData: s,
			// }
			// b, err := proto.Marshal(tp)
			// if err != nil {
			// 	fmt.Println("new input tensor marshal")
			// 	log.Fatal(err)
			// }
			// input, err := onnx.NewTensor(b)
			// if err != nil {
			// 	fmt.Println("new input tensor error")
			// 	log.Fatal(err)
			// }

			model.SetInput(0, model.GetInputTensors()[0])
			err = backend.Run()
			if err != nil {
				fmt.Println("run error")
				log.Fatal(err)
			}
			// Check error
			output, _ := model.GetOutputTensors()
			// write the first output to stdout
			fmt.Println(output[0])
			fmt.Println(output[1])
			// return numbs_in[0]
			wg.Done()
		}()
		// wg.Wait()
		return 0
	})
	return retfunc
}

func main() {
	fmt.Println("Hello, World from Go!")
	js.Global().Set("runModel", runModel())
	var wg sync.WaitGroup
	wg.Add(1)
	wg.Wait()
}

// TODO seperate main files depening on whether web build or not. Make it work w/o web and then port to WASM
