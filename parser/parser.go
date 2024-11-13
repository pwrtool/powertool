package parser

import (
	"errors"
	"github.com/pwrtool/powertool/runes"
	"strconv"
	"strings"
)

type Powerfile struct {
	Name    string
	Options []Option
	Setups  map[string]Codeblock
	Tools   []Tool
}

type Tool struct {
	Name    string
	Options []Option
	Command Codeblock
}

type Codeblock struct {
	Text     string
	Language string
}

type Option struct {
	Name          string
	DefaultValue  string   // this will be an empty string if the option is required
	PossibleFlags []string // empty if a positional option
	IsBoolean     bool
	Position      int // -1 if not a positional option
}

type Header struct {
	Text  [][]rune // slice of lines of text
	Order int      // number of octothorpes (#) preceding it
	Title []rune
}

func ParsePowerfile(content string) (Powerfile, []error) {
  powerfile := Powerfile{}
  lines := WashText(content)
  headers, err := GetAllHeaders(lines)

  if err != nil {
    return powerfile, []error{err}
  }

  if len(headers) == 0 {
    return powerfile, []error{errors.New("no headers in markdown file")}
  }


  return powerfile, nil
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

func ParseOptions(lines [][]rune) ([]Option, error) {
	options := []Option{}

	for _, line := range lines {
		if len(line) == 0 {
			panic("Somehow got a line of length 0. Invalides a programmer assumption.")
		}

		if line[0] == '-' {
			option, err := ParseOptionLine(line)

			if err != nil {
				return options, errors.Join(errors.New("Error parsing options: "), err)
			}

			options = append(options, option)
		}
	}

	return options, nil
}

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

	return option, nil
}

func parseOptionNouns(nouns []rune) ([]string, error) {
	flagStrings := []string{}
	flags := runes.ExtractInside(nouns, '`')

	if len(flags) == 0 {
		return flagStrings, errors.New("No flags found")
	}

	for _, flag := range flags {
		flagStrings = append(flagStrings, string(flag))
	}

	return flagStrings, nil
}

// default value, isBoolean, or position
type hintResult = struct {
	defaultValue string
	isBoolean    bool
	position     int
}

func parseOptionHint(hint []rune) (hintResult, error) {
	hint = runes.TrimAround(hint)
	result := hintResult{
		isBoolean:    false,
		position:     -1,
		defaultValue: "",
	}

	if len(hint) == 0 {
		return result, errors.New("hint part was only whitespace")
	}

	// debug print
	// fmt.Println("Parsing hint:", string(hint))

	if len(hint) == 1 && hint[0] == '|' {
		result.isBoolean = true
		return result, nil
	}

	defaultExtraction := runes.ExtractInside(hint, '`')

	if len(defaultExtraction) > 1 {
		return result, errors.New("found more than one default value")
	}

	if len(defaultExtraction) == 1 {
		result.defaultValue = string(defaultExtraction[0])
		return result, nil
	}

	num, err := strconv.Atoi(string(hint))

	if err != nil {
		return result, errors.Join(
			errors.New("error parsing positional option"), err)
	}

	result.position = num
	return result, nil
}

func parseOptionName(namePart []rune) (string, error) {
	extraction := runes.ExtractInside(namePart, '"')

	if len(extraction) != 1 {
		return "", errors.New("None or many extracted names were found")
	}

	return string(extraction[0]), nil
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
