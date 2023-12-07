package main

import (
	"testing"
)

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
