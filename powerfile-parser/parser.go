package parser

type Powerfile = struct {
	Name     string
	Owner    string
	Options  []Option
	Commands Command
}

type Command = struct {
	Name        string
	Description string
	Options     []Option
	Command     string
}

type Option = struct {
	Name          string
	DefaultValue  string // this will be an empty string if the option is required
	PossibleFlags string
	Requried      bool
}
