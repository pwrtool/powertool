package main

import (
	"github.com/fatih/color"
	//pt "github.com/pwrtool/powertool/core"
	"github.com/urfave/cli"
	"log"
	"os"
)

func main() {
	c := color.New(color.FgHiWhite).Add(color.Bold)

	app := &cli.App{
		Name:  "pt",
		Usage: "The cli wrapper for powertool",
		Action: func(*cli.Context) error {
			c.Println("Welcome to powertool! Run pt --help for more information")
			return nil
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
