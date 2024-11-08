package runes


func Split(text []rune, separator rune) [][]rune {
  sections := [][]rune{}
  var last int = 0;
  var i int = 0;


  for i < len(text) {
    if text[i] == separator {
      sections = append(sections, text[last:i])
      last = i
    }
    i += 1
  }

  return sections
}
