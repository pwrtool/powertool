package runner

import (
	"errors"
	"strings"

	"github.com/pwrtool/powertool/cli"
	"github.com/pwrtool/powertool/parser"
	"github.com/pwrtool/powertool/runes"
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

// this is for an expression already found between {{}}
func ParseExpression(text string) {
	if strings.Contains(text, "?") {
		// we are looking at a boolean expression

	}
}

type Expression interface {
	Evaluate(arguments map[string]string) (string, error)
}

type TextExpression struct {
	Content string
}

func (t TextExpression) Evaluate(_ map[string]string) (string, error) {
	return t.Content, nil
}

type OptionExpression struct {
	OptionName string
}

func (t OptionExpression) Evaluate(args map[string]string) (string, error) {
	value, ok := args[t.OptionName]

	if !ok {
		return "", errors.New("Arg " + t.OptionName + " not found when evaluating option expression")
	}

	return value, nil
}

type BooleanExpression struct {
	OptionName string
	TrueValue  string
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

func StripNonliteralWhitespace(s string) string {
	newString := []rune{}

	inLiteral := false
	literalTerminator := '"'

	// TODO - what about escape characters?
	for _, c := range s {
		if inLiteral {
			if c == literalTerminator {
				inLiteral = false
			}

		} else {
			if runes.IsWhitespace(c) {
				continue
			}
			if c == '\'' {
				inLiteral = true
				literalTerminator = '\''
			}
			if c == '"' {
				inLiteral = true
				literalTerminator = '"'
			}
		}

		newString = append(newString, c)
	}

	return string(newString)
}
