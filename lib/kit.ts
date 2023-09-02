/**
 * @file Handles everything a developer needs to write their own powertool kits. This file should have no external dependencies.
 * @author FireSquid6 <jonathandeiss2006@gmail.com>
 * @copyright Jonathan Deiss 2023
 * @license GPL-3.0
 */
import * as rl from "readline";
import path from "path";
import { fileURLToPath } from "url";

export const thisFile: string = fileURLToPath(import.meta.url);
export const thisDir: string = path.dirname(thisFile);

/**
 * Each "Tool" is its own script
 * @property name - The name of the tool. This is what you type in the command line to run it.
 * @property description - A brief description of what the tool does.
 * @property function - The function that runs when the tool is called.
 */
interface Tool {
  name: string;
  description: string;
  function: () => void;
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
    this.tools.push(tool);
  }

  public runTool(name: string) {
    const tool = this.tools.find((tool) => tool.name === name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    tool.function();
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
    yes_answers.forEach((yes_answer) => {
      if (answer === yes_answer) {
        return true;
      }
    });

    return false;
  }

  private async input(message: string): Promise<string> {
    return new Promise<string>((resolve) => {
      const readline = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      readline.question(message, (answer) => {
        readline.close();
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
 * Returns the direcotry where the powertool was called from. This is typically provided by the first argument in the command line.
 * @return - The absolute path to the directory, or undefined if the directory is not provided
 */
export function getCallDirectory(): string | undefined {
  if (process.argv.length < 3) {
    return undefined;
  }

  return process.argv[2];
}
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
 * Gets the config object from the config file at ~/.powertool/config.yaml
 */
export function getConfigObject(): any {}
