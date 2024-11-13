package runes

import (
	_ "fmt" // sometimes used for debugging
)

func Split(text []rune, separator rune) [][]rune {
	sections := [][]rune{}
	section := []rune{}

	for _, c := range text {
		if c == separator {
			sections = append(sections, section)
			section = []rune{}
		} else {
			section = append(section, c)
		}
	}

	sections = append(sections, section)
	return sections
}

func Equal(text []rune, other []rune) bool {
	if len(text) != len(other) {
		return false
	}

	for i := range text {
		if text[i] != other[i] {
			return false
		}
	}

	return true
}

func ExtractInside(text []rune, delimeter rune) [][]rune {
	parts := [][]rune{}
	current := []rune{}
	var inside bool = false

	for _, c := range text {
		if inside {
			if c == delimeter {
				inside = false
				parts = append(parts, current)
				current = []rune{}
			} else {
				current = append(current, c)
			}
		} else {
			if c == delimeter {
				inside = true
			}
		}
	}

	return parts
}

func RemoveWhitespace(text []rune) []rune {
	parts := []rune{}
	for _, c := range text {
		if c != ' ' && c != '\t' && c != '\n' {
			parts = append(parts, c)
		}
	}
	return parts
}

func TrimLeft(text []rune) []rune {
	i := 0

	for i < len(text) {
		if !IsWhitespace(text[i]) {
			break
		}

		i += 1
	}

	// TODO - do I need to copy?
	return text[i:]
}

func TrimRight(text []rune) []rune {
	i := len(text) - 1

	for i > 0 {
		if !IsWhitespace(text[i]) {
			break
		}

		i -= 1
	}

	return text[0 : i+1]
}

func TrimAround(text []rune) []rune {
	text = TrimRight(text)
	return TrimLeft(text)
}

func IsWhitespace(c rune) bool {
	return c == ' ' || c == '\t' || c == '\n'
}

func HasPrefix(text []rune, prefix []rune) bool {
	if len(prefix) > len(text) {
		return false
	}

	i := 0

	for i < len(text) && i < len(prefix) {
		if text[i] != prefix[i] {
			return false
		}

		i += 1
	}

	return i == len(prefix)
}

func HasPostfix(text []rune, postfix []rune) bool {
	if len(postfix) > len(text) {
		return false
	}

	i := 1

	for len(text)-i > 0 && len(postfix)-i > 0 {
		if text[len(text)-i] != postfix[len(postfix)-i] {
			return false
		}

		i += 1
	}

	return i == len(postfix)

}
