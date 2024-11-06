package parser

type Powerfile = struct {
	Name    string
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

