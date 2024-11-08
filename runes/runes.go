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
        current  = append(current, c)
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
    if !(i == ' ' || i == '\t' || i == '\n') {
      break
    }

    i += 1
  }

  // TODO - do I need to copy?
  return text[i:len(text)]
}


func TrimRight(text []rune) []rune {
  i := len(text) - 1

  for i > 0 {
    if !(i == ' ' || i == '\t' || i == '\n') {
      break
    }

    i -= 1
  }


  return text[0:i + 1]
}
