interface Tool {
  name: string;
  description: string;
  function: () => void;
}

class ToolRunner {
  private tools: Tool[] = [];

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

class Powertool {
  private toolRunner = new ToolRunner();

  public addTool(tool: Tool) {
    this.toolRunner.addTool(tool);
  }

  public run() {
    if (process.argv.length < 3) {
      throw new Error("No tool name provided");
    }

    const toolName = process.argv[2];
    this.toolRunner.runTool(toolName);
  }
}

export const powertool = new Powertool();
