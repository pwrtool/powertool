# My Powerfile
## Options
- `-s`, `--silent` = `silent` > "silent"
    this is a global option that applies to all tools and can be used in all of them

## Setup
### MacOS
```bash
brew install a bunch of stuff
```

### NixOS
```bash
echo "nixos works differently"
nix-shell -p ...
```

## Run
### Description
Blah blah blah the description can be as long as you want.

It can span multiple lines. Just make sure that it is followed by `Options` or an error will be thrown

Also note that the requirements section can be ignored, but it is still useful. In it you can list

all of the extra executables your program expects to find and
### Options
- `-o`, `--option` = `default` > "option"
    This is an argument with the default value of `default` if nothing better
    is provided. It can be triggered with the `-o` or `--option` flag, and
    referenced in the command using the "option" keyword. Everything that's
    indented like this is a comment for the previous option.

    The flags must start with - or --, otherwise the option will not be recognized.

    If there's a collision names of the option, an error will be thrown.
- `<0>` = ? > "first"
    This is the first positional argument. It has no default (indicated by
    the ?), so if it is not found there will be a runtime error
- `-b`, `--boolean` = | > "boolean"
    This is a boolean argument, indicated by the pipeline. If the flag is found, it
    will be interpreted as true, and will be false otherwise
- `<1>` = `whatever` > "second"
    This is another positional argument, but it has a default value. This prevents it from

### Command
```bash
#!/usr/bin/env bash
# a shebang is necessary at the top of the command
go run .

# we can insert normal options from the command like so:
echo {{option}}
echo {{first}}

# we can also use booleans:
echo {{!boolean ? "true!" : "false :("}}
# the above would insert "true" if the boolean is found, and
# false otherwise. The ! before the boolean is crucial

# if we need to do a bit more, we can use an if statement
{{!ifblock boolean}}

echo "This stuff will inserted if boolean is true"

{{!}}

echo "This stuff will be inserted if boolean is false"

{{!endif}}
```
