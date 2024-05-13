import (
  "fmt"
  "go-arg"
  "go-yaml"
)


type Config struct {
  ProjectsDirectory string `yaml:"projects_directory"`
  PackagesDirectory string `yaml:"packages_directory"`
  DeclarativeMode bool `yaml:"declarative_mode"`
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
  Scratch bool `arg:"-s,--scratch"`
  Force bool `arg:"-f,--force"`
}


func main() {
}
