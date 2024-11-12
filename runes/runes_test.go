package runes

import (
	"fmt"
	"testing"
)

func TestSplit(t *testing.T) {
	cases := []struct {
		input       []rune
		separator   rune
		expectation [][]rune
	}{
		{
			input:     []rune("a = b"),
			separator: '=',
			expectation: [][]rune{
				[]rune("a "),
				[]rune(" b"),
			},
		},
		{
			input:     []rune("==="),
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
			printSplitFailure(result, c.expectation)
			t.Fail()
		}

		for i := range result {
			if !Equal(result[i], c.expectation[i]) {
				printSplitFailure(result, c.expectation)
				t.Fail()
			}
		}
	}
}

func TestTrim(t *testing.T) {
	cases := []struct {
		input       []rune
		leftExpectation []rune
    rightExpectation []rune
	}{
    {
      input: []rune("   look at me!   "),
      leftExpectation: []rune("look at me!   "),
      rightExpectation: []rune("   look at me!"),
    },
  }

  for _, c := range cases {
    failed := false

    lRes := TrimLeft(c.input)
    if !Equal(lRes, c.leftExpectation) {
      fmt.Println("Failed left trim:")
      fmt.Println("Expected: |" + string(c.leftExpectation) + "|")
      fmt.Println("Got: |" + string(lRes) + "|")
      failed = true
    }

    rRes := TrimRight(c.input)
    if !Equal(rRes, c.rightExpectation) {
      fmt.Println("Failed right trim:")
      fmt.Println("Expected: |" + string(c.rightExpectation) + "|")
      fmt.Println("Got: |" + string(rRes) + "|")
      failed = true
    }

    if failed {
      t.Fail()
    }
  }
}

func printSplitFailure(output [][]rune, expectation [][]rune) {
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
