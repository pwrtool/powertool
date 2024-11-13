package parser_test

import (
	"fmt"
	"reflect"
	"strconv"
  . "github.com/pwrtool/powertool/parser"
	"testing"
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
				Name:         "option",
				DefaultValue: "default",
        PossibleFlags: []string{"-o", "--option"},
				IsBoolean:    false,
				Position:     -1,
			},
		},
		{
			input: []rune("- `-o`, `--option` = | > \"option\" "),
			expected: Option{
				Name:         "option",
				DefaultValue: "",
        PossibleFlags: []string{"-o", "--option"},
				IsBoolean:    true,
				Position:     -1,
			},
		},
		{
			input: []rune("- `-o`, `--option` = 1252 > \"option\" "),
			expected: Option{
				Name:         "option",
				DefaultValue: "",
        PossibleFlags: []string{"-o", "--option"},
				IsBoolean:    false,
				Position:     1252,
			},
		},
	}

  for _, c := range cases {
    result, err := ParseOptionLine(c.input);

    if (!reflect.DeepEqual(result, c.expected)) {
      fmt.Println("----- Expected: ")
      printOption(c.expected)
      fmt.Println("----- Got: ")
      printOption(result)
      fmt.Println("----- Had error: ")
      fmt.Println(err)

      t.Fail()
    }

    if (err != c.err) {
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
  cases := []struct{
    input [][]rune
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
          Name: "option",
          DefaultValue: "default",
          PossibleFlags: []string{"-o", "--option"},
          IsBoolean: false,
          Position: -1,
        },
        {
          Name: "boolean",
          DefaultValue: "",
          PossibleFlags: []string{"-b"},
          IsBoolean: true,
          Position: -1,
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


