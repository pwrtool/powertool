package main

import (
	"strings"
)

func getArguments(cliArgs []string, currentDirectory string, silent bool) map[string]string {
	return map[string]string{}
}

func parseArg(arg string) (string, string) {
	if strings.HasPrefix(arg, "--") {
		argParts := strings.Split(arg, "=")
		if len(argParts) == 1 {
			return argParts[0], ""
		} else {
			return argParts[0], argParts[1]
		}
	} else {
		return "", ""
	}
}
