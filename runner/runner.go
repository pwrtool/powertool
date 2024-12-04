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
func ParseExpression(text string) (Expression, error) {
	text = StripNonliteralWhitespace(text)
	if strings.Contains(text, "?") {
		// we are looking at a boolean expression
		expression := BooleanExpression{}

		split := strings.Split(text, "?")

		// if this fails then something is very very wrong
		// ther should be at least length 2 in the split
		// because we just checked that
		expression.OptionName = split[0]
		remainder := strings.Join(split[1:], "")

		literals := ExtractInsideLiterals(remainder)

		if len(literals) != 2 {
			return expression, errors.New("found more than 2 or less than 2 literals")
		}

		expression.TrueValue = literals[0]
		expression.FalseValue = literals[1]

		return expression, nil

	} else {
		expression := OptionExpression{}
		expression.OptionName = text
		return expression, nil
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

func ExtractInsideLiterals(s string) []string {
	strings := []string{}
	inLiteral := false
	literalTerminator := '"'
	currentText := []rune{}

	for _, c := range s {
		if inLiteral {
			if c == literalTerminator {
				inLiteral = false
				strings = append(strings, string(currentText))
				currentText = []rune{}
			} else {
				currentText = append(currentText, c)
			}
		} else {
			if c == '\'' {
				inLiteral = true
				literalTerminator = '\''
			}
			if c == '"' {
				inLiteral = true
				literalTerminator = '"'
			}
		}
	}

	return strings
}

func TokenizeText(text string) []Token {
	tokens := []Token{}

	for _, c := range text {

	}

	return tokens
}

type Token struct {
	kind    TokenKind
	literal string
}

type TokenKind int

const (
	TEXT TokenKind = iota
	L_BRACKET
	R_BRACKET
)
