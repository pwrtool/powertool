import { program } from "commander";

program
  .name("stencildrop")
  .description("A CLI tool for easily generating react components")
  .version("0.0.1")
  .action(() => {
    console.log(
      "Use 'stencildrop component' or 'stencildrop project' to create a new project or comopenent"
    );
  });

program.command("component <name>").action((name) => {
  console.log(`Creating component ${name}`);
});

program.parse();
