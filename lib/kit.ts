/**
 * @file Handles everything a developer needs to write their own powertool kits.
 * @author FireSquid6 <jonathandeiss2006@gmail.com>
 * @copyright Jonathan Deiss 2023
 * @license GPL-3.0
 */
import inquirer from "inquirer";
import chalk from "chalk";

const log = console.log;

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
 * Hidden class that runs and adds tools
 */
export class ToolRunner {
  private tools: Tool[] = [];

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
 * @extends ParentClassNameHereIfAny
 */
export class Powertool {
  private toolRunner = new ToolRunner();

  constructor() {}

  /**
   * Adds a tool to the tool runner
   * @param tool - the tool to ad to the tool runner
   * @returns void
   */
  public addTool(tool: Tool) {
    this.toolRunner.addTool(tool);
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
  private prompter = inquirer.createPromptModule();

  constructor() {}

  async prompt<T>(question: string): Promise<T> {
    const answer: string = await this.prompter([
      {
        type: "input",
        name: "q",
        message: `${chalk.blue.bold(question)}`,
      },
    ]).then((answers) => {
      return answers.q;
    });

    const answerParsed = answer as T;
    if (answerParsed !== undefined) {
      return answerParsed;
    }

    return Promise.reject("Answer could not be parsed to specified type");
  }
}

export const io = new IO();
