package main

import (
	pt "github.com/pwrtool/powertool/core"
	"testing"
)

func Test_getArguments(t *testing.T) {
	data := []struct {
		cliArgs  []string
		tool     string
		expected []pt.Argument
	}{
		{
			cliArgs: []string{"test", "--test=true", "--test2=false", "test"},
			tool:    "test",
			expected: []pt.Argument{
				{Key: "test", Value: true},
				{Key: "test2", Value: false},
			},
		},
		{
			cliArgs: []string{"go", "run", "--flag", "x", "--flag2", "y", "--test=2"},
			tool:    "x",
			expected: []pt.Argument{
				{Key: "flag2", Value: true},
				{Key: "test", Value: int64(2)},
			},
		},
	}

	for _, d := range data {
		args := getArguments(d.cliArgs, d.tool)
		if len(args) != len(d.expected) {
			t.Errorf("Expected %d arguments, got %d", len(d.expected), len(args))
		}
		for i, arg := range args {
			if arg.Key != d.expected[i].Key {
				t.Errorf("Expected argument %d key to be %s, got %s", i, d.expected[i].Key, arg.Key)
			}
			if arg.Value != d.expected[i].Value {
				t.Errorf("Expected argument %d value to be %s, got %s", i, d.expected[i].Value, arg.Value)
			}
		}
	}
}

func Test_parseArg(t *testing.T) {
	data := []struct {
		input         string
		expectedKey   string
		expectedValue interface{}
	}{
		{input: "--test=true", expectedKey: "test", expectedValue: true},
		{input: "--test=false", expectedKey: "test", expectedValue: false},
		{input: "--a=b", expectedKey: "a", expectedValue: "b"},
		{input: "--num=123", expectedKey: "num", expectedValue: int64(123)},
		{input: "--num=123.456", expectedKey: "num", expectedValue: float64(123.456)},
		{input: "--num=123.456.789", expectedKey: "num", expectedValue: "123.456.789"},
		{input: "-a", expectedKey: "a", expectedValue: true},
	}

	for _, d := range data {
		key, value := parseArg(d.input)
		if key != d.expectedKey {
			t.Errorf("Expected key to be %s, got %s", d.expectedKey, key)
		}
		if value != d.expectedValue {
			t.Errorf("Expected value to be %s, got %s", d.expectedValue, value)
		}
	}
}
