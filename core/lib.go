package core

const Version = "0.0.1"

// This data is passed to all run.sh files as the second argument in the form of a JSON string
type Rundata struct {
	Tool         string
	Arguments    []Argument
	Automated    bool     // If this is true, then the tool should not ask for user input
	MockInputs   []string // If a kit requires user input but is being automated, it can pull from this MockInputs array
	RunDirectory string
	Config       map[string]interface{}
	Silent       bool
}

type Argument struct {
	Key   string
	Value interface{}
}
