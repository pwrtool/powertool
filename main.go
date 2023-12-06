package main

import (
	"fmt"
	"github.com/pwrtool/powertool/core"
)

func main() {
	fmt.Println(`
pwrtool/powertool is not an actual package. It needs to be a go module to make everything work properly

If you're a new contributor, you're probably looking for:
cli/main.go - contributing to the CLI
core/lib.go - contributing to the core codebase for powertool
	`)
	core.RunShFile("/home/firesquid/scripts/test.sh", core.Rundata{
		Tool:         "test",
		Arguments:    map[string]string{"test": "test"},
		Automated:    false,
		MockInputs:   []string{"I love big guys"},
		RunDirectory: "/home/firesquid/scripts",
	})
}
