import { io, powertool } from "powertool/kit";

powertool.addTool({
  name: "say-hello",
  description: "Says hello",
  function: () => {
    io.out("Hello!");
  },
});

powertool.run();

process.exit(0);
