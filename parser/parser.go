package parser

import (
	"errors"
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

type Header struct {
	Text     [][]rune // slice of lines of text
	Order    int      // number of octothorpes (#) preceding it
	Title    []rune  
	Children *[]Header
}

// we want to:
// - remove all \r
// - split into [][]rune based on line (\n)
// - remove any empty lines for convinience
func WashText(content string) [][]rune {
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

func makeTree(lines [][]rune) {
  
}


func ParseHeader(line []rune) (int, []rune, error) {
  if len(line) < 1 {
    // this should be unreachable
    return 0, []rune{}, errors.New("Tried to parse line with length of 0")
  }

  octothorpes := 0
  text := []rune{}

  i := 0

  for line[i] == '#' && i < len(line) {
    octothorpes += 1

    i += 1
  }

  for line[i] == ' ' && i < len(line) {
    i += 1
  }
  
  for i < len(line) {
    text = append(text, line[i])
  }

  return octothorpes, text, nil
}
