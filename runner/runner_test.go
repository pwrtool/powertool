package runner_test

import (
	"fmt"
	"reflect"
	"testing"

	. "github.com/pwrtool/powertool/runner"
)

func TestStripNonliteralWhitespace(t *testing.T) {
	cases := []struct {
		input    string
		expected string
	}{
		{
			input:    "h e l l o \"I am a literal!\"",
			expected: "hello\"I am a literal!\"",
		},
		{
			input:    "h e l l o 'I am a literal!'",
			expected: "hello'I am a literal!'",
		},
	}

	for _, c := range cases {
		result := StripNonliteralWhitespace(c.input)

		if result != c.expected {
			fmt.Println("Expected:")
			fmt.Println(c.expected)
			fmt.Println("Got:")
			fmt.Println(result)

			t.Fail()
		}
	}
}

func TestExtractInsideLiterals(t *testing.T) {
	cases := []struct {
		input    string
		expected []string
	}{
		{
			input: "this is 'some stuff' and 'some other stuff' and \"some final stuff\"",
			expected: []string{
				"some stuff",
				"some other stuff",
				"some final stuff",
			},
		},
	}

	for _, c := range cases {
		result := ExtractInsideLiterals(c.input)

		if !reflect.DeepEqual(result, c.expected) {
			fmt.Println("Expected: ")
			fmt.Printf("%#v\n", c.expected)
			fmt.Println("Got:")
			fmt.Printf("%#v\n", result)

			t.Fail()
		}
	}

}

func TestParseExpression(t *testing.T) {
	cases := []struct {
		input    string
		expected Expression
	}{
		{
			input: "mything  ",
      expected: OptionExpression{
        OptionName: "mything",
      },
		},
    {
      input: "var ? 'yes!' 'no:('",
      expected: BooleanExpression{
        OptionName: "var",
        TrueValue: "yes!",
        FalseValue: "no:(",
      },
    },
	}


  for _, c := range cases {
    result, err := ParseExpression(c.input)

    if err != nil {
      fmt.Println("Got error:")
      fmt.Println(err)
      t.Fail()
    }


    if !reflect.DeepEqual(result, c.expected) {
      fmt.Println("Got:")
      fmt.Printf("%#v\n", result)
      fmt.Println("Expected:")
      fmt.Printf("%#v\n", c.expected)
      t.Fail()
    }
  }
}
