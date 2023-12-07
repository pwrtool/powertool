package main

import (
	"fmt"
	"github.com/alecthomas/kong"
	pt "github.com/pwrtool/powertool/core"
	"log"
	"os"
)

var Version = "0.0.1"

var CLI struct {
	X struct {
		Kit    string `arg:"" name:"kit" help:"Kit to use." required:""`
		Tool   string `arg:"" name:"tool" help:"Tool to use." required:""`
		Silent bool   `name:"silent" short:"s" help:"Runs powertool with no extra output" default:"0" optional:""`
	} `cmd:"" help:"Runs a specified powertool"`
	Install struct {
		KitUrl string `arg:"" help:"Url of the kit to install."`
	} `cmd:"" help:"Installs a specified kit"`
	Uninstall struct {
		Kit string `arg:"" help:"Kit to uninstall."`
	} `cmd:"" help:"Uninstalls a specified kit"`
	Info struct {
		Kit string `arg:"" help:"Kit to get info on."`
	} `cmd:"" help:"Gets info on a specified kit"`
	List struct {
	} `cmd:"" help:"Lists all installed kits"`
	Version struct {
	} `cmd:"" help:"Prints the version of powertool"`
	TestInstall struct {
	} `cmd:"" help:"Installs the current working directory as if it were a kit"`
	TestRun struct {
		Tool string `arg:"" help:"Tool to run."`
	} `cmd:"" help:"Runs the current working directory as if it were a kit"`
}

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatalln("Error getting current working directory")
	}

	ctx := kong.Parse(&CLI)
	switch ctx.Command() {
	case "x <kit> <tool>":
		kit := CLI.X.Kit
		tool := CLI.X.Tool
		slient := CLI.X.Silent

		err := pt.RunKit(kit, pt.Rundata{
			Tool:         tool,
			Arguments:    []pt.Argument{},
			Automated:    false,
			MockInputs:   []string{},
			RunDirectory: cwd,
			Silent:       slient,
		})
		if err != nil {
			log.Fatalln("Error running kit:", err)
		}
	case "install <kit-url>":
		kitUrl := CLI.Install.KitUrl
		err := pt.InstallKit(kitUrl)
		if err != nil {
			log.Fatalln("Error installing kit:", err)
		}
	case "uninstall <kit>":
		kit := CLI.Uninstall.Kit
		err := pt.UninstallKit(kit)
		if err != nil {
			log.Fatalln("Error uninstalling kit:", err)
		}
	case "version":
		fmt.Println("Running Powertool Version:", pt.Version)
		fmt.Println("Running CLI Version", Version)
	default:
		fmt.Println("Command not found")
	}

}
