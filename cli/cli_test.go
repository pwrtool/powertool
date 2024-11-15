package cli_test

import (
	"fmt"
	. "github.com/pwrtool/powertool/cli"
	"github.com/pwrtool/powertool/parser"
	"reflect"
	"testing"
)

func TestParseCommandArgs(t *testing.T) {
	cases := []struct {
		args     []string
		options  []parser.Option
		expected map[string]string
	}{
		{
			args: []string{
				"-c",
				"myCustomConfig",
				"--boolean",
				"positionalValue",
			},
			options: []parser.Option{
				{
					Name:          "config",
					PossibleFlags: []string{"-c"},
					DefaultValue:  "defaultConfig",
					IsBoolean:     false,
					Position:      -1,
				},
				{
					Name:          "positional",
					PossibleFlags: []string{},
					DefaultValue:  "",
					IsBoolean:     false,
					Position:      1,
				},
				{
					Name:          "boolean",
					PossibleFlags: []string{"--boolean"},
					DefaultValue:  "",
					IsBoolean:     true,
					Position:      -1,
				},
			},
			expected: map[string]string{
				"config":     "myCustomConfig",
				"boolean":    STRING_TRUE,
				"positional": "positionalValue",
			},
		},
	}

	for _, c := range cases {
		result, err := ParseCommandArgs(c.args, c.options)

		if err != nil {
			fmt.Println("Got error: ")
			fmt.Println(err)
			t.Fail()
		}

		if !reflect.DeepEqual(result, c.expected) {
			fmt.Println("Test failed - bad result")
			fmt.Println("Expected:")
			fmt.Printf("%#v\n", c.expected)

			fmt.Println("Got:")
			fmt.Printf("%#v\n", result)

			t.Fail()
		}

	}

}
