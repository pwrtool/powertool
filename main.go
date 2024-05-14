package main

import (
	"fmt"
  "github.com/alexflint/go-arg"
)

type Config struct {
  ProjectsDirectory string `yaml:"projects_directory"`
  ScratchesDirectory string `yaml:"scratches_directory"`
  PackagesDirectory string `yaml:"packages_directory"`
  Packages []string `yaml:"packages"`
}

type InstallCommand struct {
  Package string `arg:"positional"`
}

type RemoveCommand struct {
  Package string `arg:"positional"`
}

type CreateCommand struct {
  Package string `arg:"positional"`
  Directory string `arg:"positional"`
  Scratch bool `arg:"-s,--scratch" default:"false"`
  Force bool `arg:"-f,--force"`
}


func main() {
  var args struct {
    Install *InstallCommand `arg:"subcommand:install"`
    Remove *RemoveCommand `arg:"subcommand:remove"`
    Create *CreateCommand `arg:"subcommand:create"`
    Quiet bool `arg:"-q,--quiet"`
  }

  arg.MustParse(&args)

  switch {
  case args.Install != nil:
    fmt.Println("Install", args.Install.Package)
  case args.Create != nil:
    fmt.Println("Create", args.Create.Package)
  case args.Remove != nil:
    fmt.Println("Remove", args.Remove.Package)
  default:
    fmt.Println("No command specified")
  }

}
