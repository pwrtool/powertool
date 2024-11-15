package cli
import (
  "github.com/pwrtool/powertool/parser"
)

const STRING_FALSE = "FALSE"
const STRING_TRUE = "TRUE"

func ParseCommandArgs(args []string, options []parser.Option) (map[string]string, error) {
  argMap := map[string]string{}
  requiredOptions := []string{}

  for _, option := range options {
    if option.IsBoolean {
      argMap[option.Name] = STRING_FALSE
    } else if option.DefaultValue != "" {
      argMap[option.Name] = option.DefaultValue;
    } else {
      // option is required!
      requiredOptions = append(requiredOptions, option.Name)
    }

  }


  return argMap, nil

}
