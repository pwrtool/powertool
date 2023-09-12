'use strict';

var rl = require('readline');
var path = require('path');
var url = require('url');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var rl__namespace = /*#__PURE__*/_interopNamespaceDefault(rl);

const thisFile = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href)));
path.dirname(thisFile);
class ToolRunner {
    tools = [];
    constructor() { }
    addTool(tool) {
        this.tools.push(tool);
    }
    runTool(name) {
        const tool = this.tools.find((tool) => tool.name === name);
        if (!tool) {
            throw new Error(`Tool ${name} not found`);
        }
        tool.function();
    }
}
class Powertool {
    toolRunner = new ToolRunner();
    constructor() { }
    addTool(tool) {
        this.toolRunner.addTool(tool);
    }
    run() {
        if (process.argv.length < 3) {
            throw new Error("No tool name provided");
        }
        const toolName = process.argv[2];
        this.toolRunner.runTool(toolName);
    }
}
const powertool = new Powertool();
class IO {
    constructor() { }
    async prompt(question) {
        const answer = await this.input(`\x1b[37;1m${question}: \x1b[0m`);
        const answerParsed = answer;
        if (answerParsed !== undefined) {
            return answerParsed;
        }
        return Promise.reject("Answer could not be parsed to specified type");
    }
    async dichotomous(question) {
        await this.input(`\x1b[37;1m${question} (y/n): \x1b[0m`).then((value) => value.toLowerCase());
        return false;
    }
    async input(message) {
        return new Promise((resolve) => {
            const readline = rl__namespace.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readline.question(message, (answer) => {
                readline.close();
                resolve(answer);
            });
        });
    }
    out(message) {
        console.log(message);
    }
    success(message) {
        console.log("\x1b[32;1m%s\x1b[0m", message);
    }
    bold(message) {
        console.log("\x1b[37;1m%s\x1b[0m", message);
    }
    warn(message) {
        console.log("\x1b[33;1m%s\x1b[0m", message);
    }
    header(message) {
        console.log("\x1b[34;1;4m%s\x1b[0m", message);
    }
    error(message) {
        console.log("\x1b[31;1m%s\x1b[0m", message);
    }
}
const io = new IO();

powertool.addTool({
  name: "say-hello",
  description: "Says hello",
  function: () => {
    io.out("Hello!");
  },
});

powertool.run();

process.exit(0);
