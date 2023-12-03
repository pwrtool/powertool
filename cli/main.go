package main

import (
	"github.com/akamensky/argparse"
)

func main() {
	parser := argparse.NewParser("pt", "A CLI frontend for powertool")

	parser.NewCommand("x", "Executes a powertool from the specified kit")
	parser.NewCommand("install", "Downloads and installs a specified kit from a url")
	parser.NewCommand("remove", "Removes a specified kit")
	parser.NewCommand("list", "Lists all installed kits")
	parser.NewCommand("update", "Updates a specified kit")
	parser.NewCommand("info", "Displays information about a specified kit")
}
