# Powertool

Powertool is a library and toolkit for building, running, and automating tasks. It allows users to build a `tool` which automates a task, package them into `kits`, and then run those tools. These kits are just github repos that can be shared easily with other people. For more information, see the powertool website (coming soon-https://github.com/pwrtool/site).

# Install

Powertool is only compatable with Linux, MacOS, and WSL at the moment. It is assumed that you have git installed.

If it isn't installed already, install bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Now clone this repo somewhere. If you're a linux user, I'd recommend /usr/local/powertool/. I'm not a Mac user, so if you're on Mac just put it whever is convinient for you.

```bash
sudo git clone https://github.com/pwrtool/powertool.git /usr/local/powertool
```

To get the `ptx` and `pwrtool` commands, you'll need to add the `/bin` path of the repo you just cloned to your path. If you put it in /usr/local/, you can just add these lines to your `.bashrc`, `.profile`, `.zshrc`, or whatever:

```
export PATH=$PATH:/usr/local/pwrtool/bin
```

# Usage

## Kit management

Install a new kit:

```bash
pwrtool install user/kit
```

Kits are always looked for on github. So providing powertool with `user/kit` will cause it to look for the repo at `https://github.com/user/kit.git`.

Uninstalling and updating is fairly straightforward:

```bash
pwrtool update user/kit
pwrtool uninstall user/kit
```

Under the hood, update just deletes and reinstalls the kit.

## Running tools

You can run a tool like so:

```bash
ptx usr/kit tool-name myarg=some-value anotherarg=anothervalue
```

Tool names will only ever have alphanumeric characters + \_ and -.

## Automation

You can automate a chain of multiple tools using action files. These will be coming with powertool version `2.0.0`.
