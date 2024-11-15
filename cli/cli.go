package cli

import (
	"errors"
	"github.com/pwrtool/powertool/parser"
)

const STRING_FALSE = "FALSE"
const STRING_TRUE = "TRUE"

func ParseCommandArgs(args []string, options []parser.Option) (map[string]string, error) {
  argMap := map[string]string{}
  unsatisfiedOptions := []string{}

  for _, option := range options {
    if option.IsBoolean {
      argMap[option.Name] = STRING_FALSE
    } else if option.DefaultValue != "" {
      argMap[option.Name] = option.DefaultValue;
    } else {
      // option is required!
      unsatisfiedOptions = append(unsatisfiedOptions, option.Name)
    }
  }



  if len(unsatisfiedOptions) > 0 {
    return argMap, errors.New("Option " + unsatisfiedOptions[0] + " was not satisfied")

  }


  return argMap, nil

}
