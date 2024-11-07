package parser

import (
	"testing"
  "fmt"
  "strconv"
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
		input []rune
		expected   expectation
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
    

    if (order != c.expected.order) {
      failedReason += "Order "
      failed = true
    }
    if (!runeslicesEqual(text, c.expected.text)) {
      failedReason += "Text "
      failed = true
    }
    if (err != c.expected.err) {
      failedReason += "Error "
      failed = true
    }

    if (failed) {
      fmt.Println("Failed test because: " + failedReason)
      fmt.Println("Expected: order = " + strconv.Itoa(c.expected.order) + " text = |" + string(c.expected.text) + "|")
      fmt.Println("Got     : order = " + strconv.Itoa(order) + " text = |" + string(text) + "|")
      fmt.Println()
      t.Fail()
    }
  }
}


func runeslicesEqual(r1 []rune, r2 []rune) bool {
  if (len(r1) != len(r2)) {
    return false
  }

  for i := range r1 {
    if r1[i] != r2[i] {
      return false
    }
  }

  return true
}
