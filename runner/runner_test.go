package runner_test

import (
	"fmt"
	"testing"

	. "github.com/pwrtool/powertool/runner"
)



func TestStripNonliteralWhitespace(t *testing.T) {
  cases := []struct{
    input string
    expected string
  }{
    {
      input: "h e l l o \"I am a literal!\"",
      expected: "hello\"I am a literal!\"",
    },
    {
      input: "h e l l o 'I am a literal!'",
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
