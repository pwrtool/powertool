/**
 * @file Handles everything a developer needs to write their own powertool kits. This file should have no external dependencies.
 * @author FireSquid6 <jonathandeiss2006@gmail.com>
 * @copyright Jonathan Deiss 2023
 * @license GPL-3.0
 */
import * as rl from "node:readline";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

export const thisFile: string = fileURLToPath(import.meta.url);
export const thisDir: string = path.dirname(thisFile);

/** @constant List of names that can't be used for a tool */
const BANNED_NAMES: string[] = ["help", "test"];
/** @constant list of characters that can't be used in the name of a tool*/
const BANNED_CHARACRERS: string[] = [" ", "\n", "\t", "\r"];

/**
 * Each "Tool" is its own script
 * @property name - The name of the tool. This is what you type in the command line to run it.
 * @property description - A brief description of what the tool does.
 * @property function - The function that runs when the tool is called.
 */
interface Tool {
  name: string;
  description: string;
  function: () => Promise<void> | void;
}

/**
 * A class that handles copying and moving files local to the powertool
 */
export class LocalFiles {}

/**
 * Hidden class that runs and adds tools
 */
export class ToolRunner {
  private tools: Tool[] = [
    {
      name: "help",
      description: "Prints information about the powertool",
      function: () => {
        for (const tool of this.tools) {
          io.out(`\x1b[34;1m${tool.name}\x1b[0m - ${tool.description}`);
        }
      },
    },
  ];

  constructor() {}

  public addTool(tool: Tool) {
    if (BANNED_NAMES.includes(tool.name)) {
      throw new Error(
        `Tool name ${
          tool.name
        } cannot be used. Sowwy :(\nDon't name your tools anything in:\n${BANNED_NAMES.join(
          ", "
        )}`
      );
    }

    for (const char of BANNED_CHARACRERS) {
      if (tool.name.includes(char)) {
        throw new Error(
          `Tool name ${
            tool.name
          } cannot be used. Sowwy :(\nDon't use any of these characters in your tool name:\n${BANNED_CHARACRERS.join(
            ", "
          )}`
        );
      }
    }

    // check if tool name contains a space
    if (tool.name.includes(" ")) this.tools.push(tool);
  }

  public async runTool(name: string) {
    const tool = this.tools.find((tool) => tool.name === name);
    if (tool === undefined) {
      io.error(`Tool ${name} not found`);
      exitWithFailure();
      return;
    }

    await tool.function();
    exitWithSuccess();
  }
}

/**
 * Wraps a ToolRunner and allows you to add tools and run them
 */
export class Powertool {
  private toolRunner = new ToolRunner();

  constructor() {}

  /**
   * Adds a tool to the tool runner
   * @param tool - the tool to ad to the tool runner
   * @returns void
   */
  public tool(name: string, description: string, func: () => void) {
    this.toolRunner.addTool({
      name,
      description,
      function: func,
    });
  }

  /**
   * Uses the command line arguments to figure out which tool to run
   * @return void
   */
  public run() {
    if (process.argv.length < 3) {
      throw new Error("No tool name provided");
    }

    const toolName = process.argv[2];
    this.toolRunner.runTool(toolName);
  }
}

export const powertool = new Powertool();

/**
 * Useful for getting user input and outputting text
 */
export class IO {
  private lineReader = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  constructor() {}
  /*
   * Prompts the user with a question. If the question cannot be parsed, it returns false.
   * @param question - The question to ask the user
   * @return - The answer the user gave
   */
  async prompt<T>(question: string): Promise<T> {
    const answer: string = await this.input(`\x1b[37;1m${question}: \x1b[0m`);

    const answerParsed = answer as T;
    if (answerParsed !== undefined) {
      return answerParsed;
    }

    return Promise.reject("Answer could not be parsed to specified type");
  }

  /**
   * Prompts the user with a yes or no question. Returns true if the user answers yes, false if the user answers no.
   * @param question - The question to ask the user
   * @return - The answer the user gave
   */
  async dichotomous(question: string): Promise<boolean> {
    const answer: string = await this.input(
      `\x1b[37;1m${question} (y/n): \x1b[0m`
    ).then((value: string) => value.toLowerCase());

    const yes_answers = ["y", "yes", "t", "true"];
    let flag = false;
    yes_answers.forEach((yes_answer) => {
      if (answer === yes_answer) {
        console.log("answer is good");
        flag = true;
        return;
      }
    });

    return Promise.resolve(flag);
  }

  private async input(message: string): Promise<string> {
    return new Promise<string>((resolve) => {
      this.lineReader.question(message, (answer) => {
        resolve(answer);
      });
    });
  }

  // This article was very helpful:
  // https://notes.burke.libbey.me/ansi-escape-codes/

  /**
   * Outputs a message to the console
   * @param message - The message to output
   * @return void
   */
  out(message: string) {
    console.log(message);
  }

  /**
   * Outputs a message to the console in green and bold text
   * @param message - The message to output
   * @return void
   */
  success(message: string) {
    console.log("\x1b[32;1m%s\x1b[0m", message);
  }

  /**
   * Outputs a message to the console in blue and bold text
   * @param message - The message to output
   * @return void
   */
  bold(message: string) {
    console.log("\x1b[37;1m%s\x1b[0m", message);
  }

  /**
   * Outputs a message to the console in yellow and bold text
   * @param message - The message to output
   * @return void
   */
  warn(message: string) {
    console.log("\x1b[33;1m%s\x1b[0m", message);
  }

  /**
   * Outputs a message to the console in bold blue text with an underline
   * @param message - The message to output
   * @return void
   */
  header(message: string) {
    console.log("\x1b[34;1;4m%s\x1b[0m", message);
  }

  /**
   * Outputs a message to the console in red and bold text
   * @param message - The message to output
   * @return void
   */
  error(message: string) {
    console.log("\x1b[31;1m%s\x1b[0m", message);
  }

  /**
   * Exports a message to the console in a custom color, bold, underline, and/or italic
   * @param message - The message to output
   * @param color - The color to output the message in
   * @param bold - Whether or not to bold the message
   * @param underline - Whether or not to underline the message
   * @param italic - Whether or not to italicize the message
   * @return void
   */
  custom(
    message: string,
    color: COLORS = COLORS.RESET,
    bold: boolean = false,
    underline: boolean = false,
    italic: boolean = false
  ) {
    let output = color + message + COLORS.RESET;

    if (bold) {
      output = "\x1b[1m" + output;
    }

    if (underline) {
      output = "\x1b[4m" + output;
    }

    if (italic) {
      output = "\x1b[3m" + output;
    }

    console.log(output);
  }
}

export enum COLORS {
  BLACK = "\x1b[30m",
  RED = "\x1b[31m",
  GREEN = "\x1b[32m",
  YELLOW = "\x1b[33m",
  BLUE = "\x1b[34m",
  MAGENTA = "\x1b[35m",
  CYAN = "\x1b[36m",
  WHITE = "\x1b[37m",
  RESET = "\x1b[0m",
}

export const io = new IO();

/**
 * Exits the program with process.exit(1) in case you're like me and always forget whether to use 0 or 1
 */
export function exitWithFailure() {
  process.exit(1);
}

/**
 * Happily exits the program with process.exit(0) in case you're like me and always forget whether to use 0 or 1
 */
export function exitWithSuccess() {
  process.exit(0);
}
/**
 * Turns the local .ptconfig.json and the global ~/.powertool/config.json into a single config object. Local values will be prioritized.
 */
export class Config {
  private config: Map<string, any> = new Map<string, string>();

  constructor() {
    const globalConfig = path.join(
      os.homedir(),
      ".config/powertool",
      "config.json"
    );
    const globalConfigJson = require(globalConfig);
    for (const key in globalConfigJson) {
      this.config.set(key, globalConfigJson[key]);
    }
  }

  /**
   * Gets a value from the config. If the value does not exist, it returns the provided default value. If no d
   * @param key - The name of the key to get
   * @param notfound - The default value to return if the key does not exist
   * @return - The value of the config key
   */
  public get(key: string, notfound: string): any {
    const value = this.config.get(key);
    if (!value) {
      return notfound;
    }

    return value;
  }
}

/**
 * A class that handles command line arguments. An example command would be:
 * `pwrtool cooluser/kit tool property=value name=JonDoe`
 */
export class CliArgs {
  private args: Map<string, string> = new Map<string, string>();

  constructor() {
    process.argv.forEach((arg) => {
      const argParts = arg.split("=");
      if (argParts.length === 2) {
        this.args.set(argParts[0], argParts[1]);
      }
    });
  }

  /**
   * Gets a value from the command line arguments. Returns not found if the argument does not exist.
   * @param  key - The name of the key to get
   * @return the value of the key
   */
  public get<T>(key: string, notfound: T): T {
    const value = this.args.get(key);
    if (!value) {
      return notfound;
    }

    return value as T;
  }

  /**
   * Checks if a key exists in the command line arguments
   * @param key - The name of the key to check
   * @return true if the key exists, false if it does not
   */
  public has(key: string): boolean {
    return this.args.has(key);
  }
}
