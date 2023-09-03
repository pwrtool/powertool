We're still building the early tools, but stay tuned for more to come!


# What is powertool?
You'll need the following two definitions before proceeding:  

`tool` - a script or part of a script that automates a repetitive task  
`kit` - a collection of tools that can be installed together

Powertool is:
- A cli for installing and running these tools
- Libraries for building these kits in the following languages:
  - node.js (stable)
  - python (planned)
  - rust (planned)
  - lua (planned)
  - Anything you'd like if you're willing to build a library for it.
- A website to find and publish kits (coming soon!)

# How do I use powertool?
You'll need the following dependencies to use powertool:
- node.js
- git
- rollup
- An operating system that can run bash scripts.

Most tools will be built in node. If you're using a tool built in python, rust, or lua, you'll need that language installed as well.
```
npm install -g @powertool/pwrtl
```

# How does a powertool kit actually work?
It's incredibly simple to automate things with powertool. If you can write code to do it, you can probably write code to do it.

A powertool kit at its core is just three files in a github repository:
- `install.sh`
- `run.sh`
- `kit.json` (not implemented yet)

The `install.sh` script is called to install the kit, and the `run.sh` script is called to run the kit. The `kit.json` file is used to provide extra information to the powertool website.


The simplest example of a kit would be a repository with the following two files:
```bash
#!/bin/sh
# install.sh

# this file is run within the context of the entire repository, which is cloned in a temporary directory to 

# moves to the directory where this file is being called
cd "$(dirname "$0")"

# the directory to install the tool into is passed into this script
INSTALL_DIR=$1

# ensure that the install directory exists
mkdir -p $INSTALL_DIR

# copy the run file to the install dir
cp run.sh $INSTALL_DIR/index.js
```
```bash
# run.sh
echo "hello world!"
```
of course, this example will not implement multiple tools and will have no user input. The real magic happens when we introduce a broader programming language.

# Building kits
You could theoretically use any language to build a kit, although the most common way to build a kit is with typescript, node, and rollup.

To start building a kit, do the following:
- create an empty git project
- run `pwrtl run pwrtl/std-kit-node`
- 


