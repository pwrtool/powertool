package parser

import (
	"errors"
	"strings"

	"github.com/pwrtool/powertool/runes"
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
	DefaultValue  string   // this will be an empty string if the option is required
	PossibleFlags []string // empty if a positional option
	IsBoolean     bool
	Position      int // -1 if not a positional option
	Description   string
}

type Header struct {
	Text  [][]rune // slice of lines of text
	Order int      // number of octothorpes (#) preceding it
	Title []rune
}

// func ParsePowerfile(content string) (Powerfile, []error) {
//   lines := WashText(content)
//   headers, err := GetAllHeaders(lines)
//
//   if err != nil {
//     return nil, []error{err}
//   }
//
//   powerfile, errs := ParseHeaders(headers)
//
//   if errs != nil {
//     return errs
//   }
//
//   return powerfile, nil
// }

// we want to:
// - remove all \r
// - split into [][]rune based on line (\n)
// - remove any empty lines for convinience
func WashText(content string) [][]rune {
	text := [][]rune{}

	content = strings.ReplaceAll(content, "\r", "")
	lines := strings.Split(content, "\n")

	for _, line := range lines {
		isWhitespace := true

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

func GetAllHeaders(lines [][]rune) ([]Header, error) {
	headers := []Header{}

	header := Header{}
	currentText := [][]rune{}

	var i int = 0
	// skip until we have a header
	for i < len(lines) {
		hashes, title, err := ParseHeaderLine(lines[i])

		if err != nil {
			return nil, err
		}
		if hashes != 0 {
			header.Order = hashes
			header.Title = title
			i += 1
			break
		}

		i += 1
	}

	for i < len(lines) {
		hashes, title, err := ParseHeaderLine(lines[i])

		if err != nil {
			return nil, err
		}

		if hashes != 0 {
			header.Text = currentText
			headers = append(headers, header)

			header = Header{}
			header.Title = title
			header.Order = hashes

			currentText = [][]rune{}
		} else {
			currentText = append(currentText, lines[i])
		}

		i += 1
	}

	header.Text = currentText
	headers = append(headers, header)

	return headers, nil
}

func ParseHeaderLine(line []rune) (int, []rune, error) {
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

	for (line[i] == ' ' || line[i] == '\t') && i < len(line) {
		i += 1
	}

	for i < len(line) {
		text = append(text, line[i])
		i += 1
	}

	return octothorpes, text, nil
}

// TODO - this needs tests
func ParseOptions(lines [][]rune) ([]Option, error) {
	options := []Option{}

	// TODO - what about description lines?
	// for _, line := range lines {
	//
	// }

	return options, nil
}

// TODO - this needs tests
func ParseOptionLine(line []rune) (Option, error) {
  option := Option{}
  
  line = runes.TrimLeft(line)
  if len(line) == 0 {
    return option, errors.New("Length of line is 0")
  }

  if line[0] != '-' {
    return option, errors.New("no dash at the start of the line")
  }

  firstSplit := runes.Split(line, '=')

  if len(firstSplit) != 2 {
    return option, errors.New("first split does not have a length of 2")
  }

  // option is in three parts:
  // - `-o`, `--option` = `default` > "option"
  //   [^ nouns]   [^ hint ]   [^ namePart]
  //
  // we have to split it into those parts
  secondSplit := runes.Split(firstSplit[1], '>')

  if len(secondSplit) != 2 {
    return option, errors.New("No > to denote the name of the option")
  }


  nouns := firstSplit[0]
  hint := secondSplit[0]
  namePart := secondSplit[1]

  // now, just parse accordingly

  result, err := parseOptionHint(hint)
  if err != nil {
    return option, err
  }
  flags, err := parseOptionNouns(nouns)
  if err != nil {
    return option, err
  }
  name, err := parseOptionName(namePart)
  if err != nil {
    return option, err
  }

  option.Name = name
  option.PossibleFlags = flags
  option.DefaultValue = result.defaultValue
  option.Position = result.position
  option.IsBoolean = result.isBoolean

  return Option{}, nil
}


func parseOptionNouns(nouns []rune) ([]string, error) {
  return []string{}, nil
}

// default value, isBoolean, or position
type hintResult = struct {
  defaultValue string
  isBoolean bool
  position int
}
func parseOptionHint(hint []rune) (hintResult, error) {
  return hintResult{}, nil
}

func parseOptionName(namePart []rune) (string, error) {
  return "", nil
}

func parseFlags(flagsText []rune) []string {
	inside := false
	current := ""
	flags := []string{}

	for _, c := range flagsText {
		if inside {
			if c == '`' {
				inside = false
				flags = append(flags, current)
				current = ""
			} else {
				current += string(c)
			}
		} else {
			if c == '`' {
				inside = true
			}
		}

	}

	return flags
}

func ParseRequirements(lines [][]rune) ([][]rune, error) {
	requirements := [][]rune{}

	for _, line := range lines {
		if line[0] != '-' {
			return nil, errors.New("Invalid requirement line")
		}

		var i int = 1

		if i > len(line) {
			return nil, errors.New("Unused requirements line")
		}

		for line[i] == ' ' || line[i] == '\t' {
			i += 1
		}

		requirements = append(requirements, line[i:])
	}

	return requirements, nil
}

// func ParseHeaders(headers []Header) Powerfile {
//
// }
