package main

import (
	"fmt"
	"github.com/alecthomas/kong"
	pt "github.com/pwrtool/powertool/core"
	"log"
	"os"
)

func testInstall(cwd string) error {
	script := cwd + "/install.sh"
	installFolder := pt.GetPowertoolDirectory() + "/bench/test"
	if _, err := os.Stat(script); err == nil {
		pt.Execute(script, []string{script, installFolder})
	} else {
		log.Fatalln("Install script not found")
		return err
	}
	return nil
}

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
	} `cmd:"" help:"Prints the README of a specified kit."`
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

		args := getArguments(os.Args, tool)

		err := pt.RunKit(kit, pt.Rundata{
			Tool:         tool,
			Arguments:    args,
			RunDirectory: cwd,
			Silent:       slient,

			// the cli never wants to set these. They are only used when powertool is being automated by something else
			MockInputs: []string{},
			Automated:  false,
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
	case "info <kit>":
		kit := CLI.Info.Kit
		folder := pt.FindKitFolder(kit)
		if folder == "" {
			log.Fatalln("Kit not found")
		}

		possibleFilenames := []string{"README.md", "README.txt", "README", "readme.md", "readme.txt", "readme"}
		for _, filename := range possibleFilenames {
			filepath := folder + "/" + filename
			if _, err := os.Stat(filepath); err == nil {
				printFile(filepath)
				break
			}
		}
	case "test-install":
		testInstall(cwd)

	case "test-run <tool>":
		tool := CLI.TestRun.Tool
		args := getArguments(os.Args, tool)

		err := testInstall(cwd)
		if err != nil {
			log.Fatalln("Error installing kit:", err)
		}

		err = pt.RunKit("test", pt.Rundata{
			Tool:         tool,
			Arguments:    args,
			RunDirectory: cwd,
			Silent:       false,
			Automated:    false,
			MockInputs:   []string{},
		})

	default:
		fmt.Println("Command not found. Try running 'pt --help' for a list of commands")
	}

}
