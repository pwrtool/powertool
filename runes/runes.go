package runes

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
