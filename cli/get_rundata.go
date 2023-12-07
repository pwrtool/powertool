package main

import (
	"errors"
	pt "github.com/pwrtool/powertool/core"
	"strconv"
	"strings"
)

func getArguments(cliArgs []string, tool string) []pt.Argument {
	flag := false
	args := []pt.Argument{}

	for _, arg := range cliArgs {
		if flag {
			key, value := parseArg(arg)
			if key == "" {
				continue
			}
			args = append(args, pt.Argument{
				Key:   key,
				Value: value,
			})
		} else {
			if arg == tool {
				flag = true
			}
		}
	}

	return args
}

func parseArg(arg string) (string, interface{}) {
	key := ""
	var value interface{} = 0
	if strings.HasPrefix(arg, "--") || strings.HasPrefix(arg, "-") {
		argParts := strings.Split(arg, "=")

		if len(argParts) == 0 {
			return key, value
		}

		if strings.HasPrefix(argParts[0], "--") {
			key = strings.TrimPrefix(argParts[0], "--")
		} else {
			key = strings.TrimPrefix(argParts[0], "-")
		}

		if len(argParts) == 1 {
			value = true
		} else {
			parsedInt, err := strconv.ParseInt(argParts[1], 10, 64)
			if err == nil {
				value = parsedInt
				return key, value
			}

			parsedFloat, err := strconv.ParseFloat(argParts[1], 64)
			if err == nil {
				value = parsedFloat
				return key, value
			}

			parsedBool, err := parseBool(argParts[1])
			if err == nil {
				value = parsedBool
				return key, value
			}

			value = argParts[1]
		}
	}

	return key, value
}

func parseBool(value string) (bool, error) {
	switch value {
	case "true":
		return true, nil
	case "false":
		return false, nil
	case "t":
		return true, nil
	case "f":
		return false, nil
	default:
		return false, errors.New("Invalid boolean value")
	}
}
