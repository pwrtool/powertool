package parser

import (
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

    if (len(result) != len(c.expected)) {
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
