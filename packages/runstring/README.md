# Runstring
This package is shared between the powertool cli and powertool kit packages and deals with creating and reading runstrings. If you're just a user of powertool, it doesn't matter to you. If you're a maintaner of powertool or developing highly technical kits, this may be necessary.

Read more in the docs (oops, I haven't made them yet).

# Wait what?
Powertool uses runstrings. Here is an example:
```txt
tool:my-tool;from:/home/firesquid/source/mycoolprojet;args:[arg1:hello|arg2:23];
```

When the cli runs the kit, these are passed as  

This string is gernerated by the CLI when a call to the kit is made, which parses it into the following data:
```json
{
  tool: "my-tool",
  from: "/home/firesquid/source/mycoolproject/"
  args: [
    arg1: "hello",
    arg2: 32
  ],
  autoAnswer: false,
  answer: [],
}
```

The kit package interprets this, and runs the tool "my-tool" with the command line arguments arg1 and arg2 set to their respective values. The `from` parameter can be used by the tool to perform manipulations in the directory that it was called from. 


# What's this `autoAnswer` and `answer` thing?
As you're probably aware, there are three ways for a kit to get input from a user:
1. Command line arguments 
2. Checking the config file
3. Prompting the user through stdout 

Command line arguments are passed through the runstring in the `args` field, and the config file is always located at `~/.config/pwrtool/config.json`, and therefore can be easily emulated by action files or other forms of automating powertools. However, automating stdout/stdin questions is difficult.

THis is accomplished

A runstring that utilizes this feature would look like:
```
tool:mytool;from:/home/firesquid/source/mycoolproject;arg1:hello;autoAnswer:true:answers:["wow! this is the answer to a question!"]
```


# Specifications
For more in depth specification, see the test file. If you're implementing this in another language, ensure that all tests in the test file pass.