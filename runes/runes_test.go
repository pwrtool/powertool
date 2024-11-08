package runes

import (
	"fmt"
	"testing"
)


func TestSplit(t *testing.T) {
  cases := []struct{
    input []rune
    separator rune
    expectation [][]rune
  }{
    {
      input: []rune("a = b"),
      separator: '=',
      expectation: [][]rune{
        []rune("a "),
        []rune(" b"),
      },
    },
    {
      input: []rune("==="),
      separator: '=',
      expectation: [][]rune{
        {},
        {},
        {},
        {},
      },
    },
  }


  for _, c := range cases {
    result := Split(c.input, c.separator)

    if len(result) != len(c.expectation) {
      printFailure(result, c.expectation)
      t.Fail()
    }

    for i := range result {
      if !Equal(result[i], c.expectation[i]) {
        printFailure(result, c.expectation)
        t.Fail()
      }
    }
  }
}




func printFailure(output [][]rune, expectation [][]rune) {
  fmt.Println("FAILED!!!")
  fmt.Println("Expected:")
  for _, part := range expectation {
    fmt.Println("|", part, "|")
  }
  fmt.Println("\nGot:")
  for _, part := range output {
    fmt.Println("|", part, "|")
  }
}
