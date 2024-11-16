package runner

import (
	"errors"

	"github.com/pwrtool/powertool/parser"
  "github.com/pwrtool/powertool/cli"
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

type Token interface {
	Evaluate(arguments map[string]string) (string, error)
}

type Text struct {
	Content string
}

func (t Text) Evaluate(_ map[string]string) (string, error) {
	return t.Content, nil
}

type OptionExpression struct {
	OptionName string
}

type BooleanExpression struct {
	OptionName  string
	TrueValue   string
	FalseValue string
}

func (t BooleanExpression) Evaluate(args map[string]string) (string, error) {
  value, ok := args[t.OptionName]

  if !ok {
    return "", errors.New("Arg " + t.OptionName + " not found when evaluating boolean expression")
  }

  if value == cli.STRING_TRUE {
    return t.TrueValue, nil
  }
  if value == cli.STRING_FALSE {
    return t.FalseValue, nil
  }

  return "", errors.New("Tried to evaluate non-boolean value " + t.OptionName + " as a boolean")
}
