### Options
- `-s`, `--silent` = `silent` > "silent"
    this is a global option that applies to all tools

### Requirements
- bash

# Run
## Requirements
- go

## Description
Blah blah blah the description can be as long as you want.

It can span multiple lines. Just make sure that it is followed by `Options` or an error will be thrown

Also note that the requirements section can be ignored

## Options
- `-o`, `--option` = `default` > "option"
    This is an argument with the default value of `default` if nothing better
    is provided. It can be triggered with the `-o` or `--option` flag, and
    referenced in the command using the "option" keyword. Everything that's
    indented like this is a comment for the previous option.

    The flags must start with - or --, otherwise the option will not be recognized.

    If there's a collision names of the option, an error will be thrown.
- `<0>` = ? > "first"
    This is the first positional argument. It has no default, so if nothing is provided
    the program will fail
- `-b`, `--boolean` = | > "boolean"
    This is a boolean argument. It can be referenced in the command using a different syntax
    

This argument is positional. It does whatever 


## Command
```bash
go run .
echo {{option}}
```
