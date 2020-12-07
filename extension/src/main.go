package main

import (
	"strconv"
	"syscall/js"

	"github.com/aaronpowell/webpack-golang-wasm-async-loader/gobridge"
)

func add(x js.Value, i []js.Value) (interface{}, error) {
	ret := 0

	for _, item := range i {
		val, _ := strconv.Atoi(item.String())
		ret += val
	}

	return ret, nil
}

func main() {
	c := make(chan struct{}, 0)

	// gobridge.RegisterCallback("add", add)
	gobridge.RegisterValue("someValue", "Hello World")

	<-c
}
