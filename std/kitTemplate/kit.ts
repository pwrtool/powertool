import { io, thisFile, thisDir, powertool } from "powertool/kit";

powertool.addTool({
  name: "say-hello",
  description: "Says hello",
  function: () => {
    io.out("Hello!");
  },
});

process.exit(0);
