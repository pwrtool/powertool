package runner

import (
	"github.com/pwrtool/powertool/parser"
)

type Codefile struct {
	Executable string // if this is "", we just assume there's a shebang
	Filename   string
	Text       string
}

func TransformCodeblock(codeblock []parser.Codeblock, arguments map[string]string) (Codefile, error) {
  codefile := Codefile{}
  
  return codefile, nil
}
