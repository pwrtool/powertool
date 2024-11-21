package parser_test

import (
	"fmt"
	"io"
	"os"
	"reflect"
	"strconv"
	"testing"

	. "github.com/pwrtool/powertool/parser"
)

func TestWashText(t *testing.T) {
	cases := []struct {
		expected [][]rune
		input    string
	}{
		{
			expected: [][]rune{
				[]rune("this is some text"),
				[]rune("this is some more text"),
				[]rune("this is the last text"),
			},
			input: "this is some text\n\rthis is some more text\n \t  \r \n \r \nthis is the last text",
		},
		{
			expected: [][]rune{
				[]rune("this is some text"),
				[]rune("``` blah blah blah"),
				[]rune(""),
				[]rune("this is the last text"),
				[]rune("```"),
			},
			input: "this is some text\n\n\n``` blah blah blah\n\nthis is the last text\n```\n\n",
		},
	}

	for _, c := range cases {
		result := WashText(c.input)

		if len(result) != len(c.expected) {
			println("Expected:")
			printRunes(c.expected)
			println("\nGot:")
			printRunes(result)

			t.Fail()
		}
	}
}

func printRunes(data [][]rune) {
	for _, line := range data {
		println(string(line))
	}
}

func TestParseHeader(t *testing.T) {
	type expectation = struct {
		order int
		text  []rune
		err   error
	}

	cases := []struct {
		input    []rune
		expected expectation
	}{
		{
			input: []rune("# My Header"),
			expected: expectation{
				order: 1,
				text:  []rune("My Header"),
				err:   nil,
			},
		},
		{
			input: []rune("##      \t   Another Header"),
			expected: expectation{
				order: 2,
				text:  []rune("Another Header"),
				err:   nil,
			},
		},
		{
			input: []rune("###Final Header \t     \t "),
			expected: expectation{
				order: 3,
				text:  []rune("Final Header \t     \t "),
				err:   nil,
			},
		},
		{
			input: []rune("I should fail. Not a header."),
			expected: expectation{
				order: 0,
				text:  []rune("I should fail. Not a header."),
				err:   nil,
			},
		},
	}

	for _, c := range cases {
		order, text, err := ParseHeaderLine(c.input)
		failedReason := ""
		failed := false

		if order != c.expected.order {
			failedReason += "Order "
			failed = true
		}
		if !runeslicesEqual(text, c.expected.text) {
			failedReason += "Text "
			failed = true
		}
		if err != c.expected.err {
			failedReason += "Error "
			failed = true
		}

		if failed {
			fmt.Println("Failed test because: " + failedReason)
			fmt.Println("Expected: order = " + strconv.Itoa(c.expected.order) + " text = |" + string(c.expected.text) + "|")
			fmt.Println("Got     : order = " + strconv.Itoa(order) + " text = |" + string(text) + "|")
			fmt.Println()
			t.Fail()
		}
	}
}

func runeslicesEqual(r1 []rune, r2 []rune) bool {
	if len(r1) != len(r2) {
		return false
	}

	for i := range r1 {
		if r1[i] != r2[i] {
			return false
		}
	}

	return true
}

func TestGetAllHeaders(t *testing.T) {
	cases := []struct {
		input    [][]rune
		expected []Header
		err      error
	}{
		{
			input: [][]rune{
				[]rune("a thing"),
				[]rune("# a header"),
				[]rune("a thing"),
				[]rune("more stuff"),
				[]rune("## another header"),
				[]rune("even more stuff"),
			},
			expected: []Header{
				{
					Title: []rune("a header"),
					Order: 1,
					Text: [][]rune{
						[]rune("a thing"),
						[]rune("more stuff"),
					},
				},
				{
					Title: []rune("another header"),
					Order: 2,
					Text: [][]rune{
						[]rune("even more stuff"),
					},
				},
			},
		},
	}

	for _, c := range cases {
		output, err := GetAllHeaders(c.input)

		if err != c.err {
			fmt.Println("Mismatching errors: ")
			fmt.Println("Expected: ", c.err)
			fmt.Println("Got: ", err)
			t.Fail()
			continue
		}

		if !reflect.DeepEqual(output, c.expected) {
			fmt.Println("Expected: ")
			printHeaders(c.expected)
			fmt.Println("\nGot:")
			printHeaders(output)
			t.Fail()
			continue
		}
	}
}

func printHeaders(headers []Header) {
	for _, header := range headers {
		fmt.Println("{")
		fmt.Println("    Title: ", header.Title)
		fmt.Println("    Order: ", header.Order)
		fmt.Println("    Text: {")

		for _, line := range header.Text {
			fmt.Println("        ", line)
		}
		fmt.Println("    },")
		fmt.Println("},")
	}
}

func TestParseOptionLine(t *testing.T) {
	cases := []struct {
		input    []rune
		expected Option
		err      error
	}{
		{
			input: []rune("- `-o`, `--option` = `default` > \"option\" "),
			expected: Option{
				Name:          "option",
				DefaultValue:  "default",
				PossibleFlags: []string{"-o", "--option"},
				IsBoolean:     false,
				Position:      -1,
			},
		},
		{
			input: []rune("- `-o`, `--option` = | > \"option\" "),
			expected: Option{
				Name:          "option",
				DefaultValue:  "",
				PossibleFlags: []string{"-o", "--option"},
				IsBoolean:     true,
				Position:      -1,
			},
		},
		{
			input: []rune("- `-o`, `--option` = 1252 > \"option\" "),
			expected: Option{
				Name:          "option",
				DefaultValue:  "",
				PossibleFlags: []string{"-o", "--option"},
				IsBoolean:     false,
				Position:      1252,
			},
		},
	}

	for _, c := range cases {
		result, err := ParseOptionLine(c.input)

		if !reflect.DeepEqual(result, c.expected) {
			fmt.Println("----- Expected: ")
			printOption(c.expected)
			fmt.Println("----- Got: ")
			printOption(result)
			fmt.Println("----- Had error: ")
			fmt.Println(err)

			t.Fail()
		}

		if err != c.err {
			fmt.Println("Expected error: ")
			fmt.Println(c.err)
			fmt.Println("Got error: ")
			fmt.Println(err)
		}
	}

}

func printOption(o Option) {
	fmt.Println("Name: ", o.Name)
	fmt.Println("Default: ", o.DefaultValue)
	fmt.Println("PossibleFlags: ", o.PossibleFlags)
	fmt.Println("IsBoolean: ", o.IsBoolean)
	fmt.Println("Position: ", o.Position)
}

func TestParseOptions(t *testing.T) {
	cases := []struct {
		input    [][]rune
		expected []Option
	}{
		{
			input: [][]rune{
				[]rune("yap yap yap"),
				[]rune("- `-o`, `--option` = `default` > \"option\""),
				[]rune("yap yap yap"),
				[]rune("blah blah blah"),
				[]rune("- `-b` = | > \"boolean\" "),
				[]rune("blah blah blah"),
			},
			expected: []Option{
				{
					Name:          "option",
					DefaultValue:  "default",
					PossibleFlags: []string{"-o", "--option"},
					IsBoolean:     false,
					Position:      -1,
				},
				{
					Name:          "boolean",
					DefaultValue:  "",
					PossibleFlags: []string{"-b"},
					IsBoolean:     true,
					Position:      -1,
				},
			},
		},
	}

	for _, c := range cases {
		result, err := ParseOptions(c.input)

		if err != nil {
			fmt.Println("Got an error:")
			fmt.Println(err)
			t.Fail()
		}

		if !reflect.DeepEqual(result, c.expected) {
			fmt.Println("Test failed.")

			fmt.Println("-------------------")
			fmt.Println("Expected:")
			fmt.Println("-------------------")
			for _, o := range c.expected {
				printOption(o)
				fmt.Println("")
			}

			fmt.Println("-------------------")
			fmt.Println("Got:")
			fmt.Println("-------------------")
			for _, o := range result {
				printOption(o)
				fmt.Println("")
			}

			t.Fail()
		}

	}
}

func TestParseCodeblock(t *testing.T) {
	cases := []struct {
		input    [][]rune
		expected Codeblock
	}{
		{
			input: [][]rune{
				[]rune("hello!"),
				[]rune("```lang"),
				[]rune("code language"),
				[]rune("more stuff"),
				[]rune("```"),
			},
			expected: Codeblock{
				Text:     "code language\nmore stuff\n",
				Language: "lang",
			},
		},
	}

	for _, c := range cases {
		result, err := ParseCodeblock(c.input)

		if err != nil {
			fmt.Println("Got error: ", err)
			t.Fail()
		}

		if !reflect.DeepEqual(result, c.expected) {
			fmt.Println("Expected: ")
			printCodeblock(c.expected)
			fmt.Println("Got: ")
			printCodeblock(result)
			t.Fail()
		}
	}
}

func printCodeblock(codeblock Codeblock) {
	fmt.Println("     Text: ", codeblock.Text)
	fmt.Println("     Lang: ", codeblock.Language)
}

func TestParsePowerfile(t *testing.T) {
	cases := []struct {
		inputFilename string
		expected      Powerfile
	}{
		{
			inputFilename: "./powertool.md",
			expected: Powerfile{
				Name: "My Powerfile",
				Options: []Option{
					{
						Name:          "silent",
						DefaultValue:  "silent",
						PossibleFlags: []string{"-s", "--silent"},
						IsBoolean:     false,
						Position:      -1,
					},
				},
				Setups: map[string]Codeblock{
					"MacOS": {
						Language: "bash",
						Text:     "brew install a bunch of stuff\n",
					},
					"NixOS": {
						Language: "bash",
						Text:     "echo \"nixos works differently\"\nnix-shell -p ...\n",
					},
				},
				Tools: []Tool{
					{
						Name: "run",
						Options: []Option{
							{
								Name:          "option",
								DefaultValue:  "default",
								PossibleFlags: []string{"-o", "--option"},
								IsBoolean:     false,
								Position:      -1,
							},
							{
								Name:          "first",
								DefaultValue:  "",
								PossibleFlags: []string{},
								Position:      1,
								IsBoolean:     false,
							},
							{
								Name:          "boolean",
								DefaultValue:  "",
								IsBoolean:     true,
								Position:      -1,
								PossibleFlags: []string{"-b", "--boolean"},
							},
							{
								Name:          "second",
								DefaultValue:  "whatever",
								IsBoolean:     false,
								Position:      2,
								PossibleFlags: []string{},
							},
						},
						Command: Codeblock{
							Language: "bash",
							Text: `#!/usr/bin/env bash
# a shebang is necessary at the top of the command
go run .

# we can insert normal options from the command like so:
echo {{option}}
echo {{first}}

# we can also use booleans:
echo {{boolean ? "true!" : "false :("}}
# the above would insert "true" if the boolean is found, and
# false otherwise. The ! before the boolean is crucial

# if we need to do a bit more, we can use an if statement
              `,
						},
					},
				},
			},
		},
	}

	for _, c := range cases {
		input := ""
		file, err := os.Open(c.inputFilename)

		if err != nil {
			panic("file open error during testing")
		}
		defer file.Close()

		bytes, err := io.ReadAll(file)

		if err != nil {
			panic("file reading error")
		}

		input = string(bytes)

		result, errs := ParsePowerfile(input)
		if len(errs) > 0 {
			fmt.Println("Failed with some errors:")

			for _, err := range errs {
				fmt.Println(err)
			}

			t.Fail()
		}

		if !reflect.DeepEqual(result, c.expected) {
			fmt.Println("Expected:")
			fmt.Printf("%#v\n", c.expected)
			fmt.Println("Got:")
			fmt.Printf("%#v\n", result)

			t.Fail()
		}

	}
}

// nah I don't wanna test this tbh
//
// will write tests later if stuff is broken, Sorry future
// self for being lazy
//
// func TestParseTool(t *testing.T) {
// 	cases := []struct {
// 		name     string
// 		input    []Header
// 		expected Tool
// 	}{
//     {
//       name: "a cool tool",
//       input: []Header{
//
//       },
//       expected: Tool{
//         Options: []Option{
//
//         }
//       }
//     },
//   }
//
//   for _, c := range cases {
//     result, err := ParseTool(c.name, c.input)
//
//     if err != nil {
//       fmt.Println("Got error: " , err)
//
//       t.Fail()
//     }
//
//     if !reflect.DeepEqual(result, c.expected) {
//       fmt.Println("Expected:")
//       fmt.Printf("%#v\n", c.expected)
//       fmt.Println("Got:")
//       fmt.Printf("%#v\n", result)
//
//       t.Fail()
//     }
//   }
// }

func TestParseSetups(t *testing.T) {
  cases := []struct{
    input []Header
    expected map[string]Codeblock
  }{
    {
      input: []Header{
        {
          Title: []rune("MacOS"),
          Order: 3,
          Text: [][]rune{
            []rune("```bash"),
            []rune("blah blah balh"),
            []rune("```"),
          },
        },
        {
          Title: []rune("Linux"),
          Order: 3,
          Text: [][]rune{
            []rune("```bash"),
            []rune("more linux stuff"),
            []rune("```"),
          },
        },
        {
          Title: []rune("Windows"),
          Order: 3,
          Text: [][]rune{
            []rune("```bash"),
            []rune("GO FUCK YOURSELF!!!!"),
            []rune("```"),
          },
        },
      },
      expected: map[string]Codeblock{
        "MacOS": {
          Language: "bash",
          Text: "blah blah blah",
        },
        "Linux": {
          Language: "bash",
          Text: "more linux stuff",
        },
        "Windows": {
          Language: "powershell",
          Text: "GO FUCK YOURSELF!!!!",
        },
      },
    },
  }

  for _, c := range cases {
    result, err := ParseSetup(c.input)

    if err != nil {
      fmt.Println("Got error: ", err)
      t.Fail()
    }

    if !reflect.DeepEqual(result, c.expected) {
      fmt.Println("Expected:")
      fmt.Printf("%#v\n", c.expected)
      fmt.Println("Got:")
      fmt.Printf("%#v\n", result)
      
      t.Fail()
    }
  }
}

