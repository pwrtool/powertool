package parser

import (
	"strings"
)

type Powerfile struct {
	Name    string
	Options []Option
	Tools   []Tool
}

type Tool struct {
	Name         string
	Description  string
	Options      []Option
	Command      string
	Requirements []string
}

type Option struct {
	Name          string
	DefaultValue  string // this will be an empty string if the option is required
	PossibleFlags string
	Requried      bool
}

// ## My Cool Header
// blah blah blah
//
// ### A cooler header
// even more blah
// 
//
// ^^^ should become:
// header {
//   text = blah blah blah
//   order = 2
//   title = My Cool Header
//   children = ... (you get the point)
// }

type header struct {
	text     [][]rune // slice of lines of text
	order    int      // number of octothorpes (#) preceding it
	title    []rune  
	children *[]header
}

// we want to:
// - remove all \r
// - split into [][]rune based on line (\n)
// - remove any empty lines for convinience
func washText(content string) [][]rune {
	text := [][]rune{}

	content = strings.ReplaceAll(content, "\r", "")
	lines := strings.Split(content, "\n")

	for _, line := range lines {
    isWhitespace := false
    
    for _, c := range line {
      if !(c == ' ' || c == '\t') {
        isWhitespace = false
        break
      }
    }

    if !isWhitespace {
      text = append(text, []rune(line))
    }
	}

	return text
}
