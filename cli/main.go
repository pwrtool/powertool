package main

import (
	"fmt"
	"github.com/alecthomas/kong"
)

var CLI struct {
	X struct {
		Kit    string `arg:"" name:"kit" help:"Kit to use." required:""`
		Tool   string `arg:"" name:"tool" help:"Tool to use." required:""`
		Silent bool   `name:"silent" short:"s" help:"Runs powertool with no extra output" default:"0" optional:""`
	} `cmd:"" help:"Runs a specified powertool"`
	Install struct {
		Kit string `arg:"" help:"Kit to install."`
	} `cmd:"" help:"Installs a specified kit"`
}

func main() {
	ctx := kong.Parse(&CLI)
	switch ctx.Command() {
	case "x <kit> <tool>":
		kit := CLI.X.Kit
		tool := CLI.X.Tool
		slient := CLI.X.Silent
		fmt.Println("Running:", kit, tool)
		fmt.Println("Silent:", slient)
	case "install":
		kit := CLI.Install.Kit
		fmt.Println("install", kit)
	default:
		fmt.Println("Command not found")
	}

}
