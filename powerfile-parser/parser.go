package parser

import (
	"strings"
)

type Powerfile = struct {
	Name    string
	Owner   string
	Options []Option
	Tools   []Tool
}

type Tool = struct {
	Name         string
	Description  string
	Options      []Option
	Command      string
	Requirements []string
}

type Option = struct {
	Name          string
	DefaultValue  string // this will be an empty string if the option is required
	PossibleFlags string
	Requried      bool
}

type parser struct {
	content   string
	position  int
	powerfile Powerfile
}

func newParser(content string) parser {
  return parser{
    content: content,
    position: -1,
    powerfile: Powerfile {
      Name: "",
      Owner: "",
      Options: []Option{},
    },
  }
}

func (p *parser) parseFile() {

}

func (p *parser) advance() string {
  if p.position > len(p.content) {
    // this might be not smart
    return ""
  }

  p.position += 1
  return p.content
}
