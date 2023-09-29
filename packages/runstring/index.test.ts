import { ParsedRunstring, generateRunstring, parseRunstring } from ".";
import { describe, test, expect } from "bun:test";

describe("generateRunstring", () => {
  test("should deal with no answers", () => {
    const runstring: ParsedRunstring = {
      tool: "test",
      from: "/some/sort/of/path",
      arguments: new Map([
        ["a", "coolarg"],
        ["c", "23"],
      ]),
      autoAnswer: false,
      answers: [],
    };
    expect(generateRunstring(runstring)).toEqual(
      "tool:test;from:/some/sort/of/path;args:[a:coolarg,c:23,];autoAnswer:f;answers:[]"
    );
  });
  test("should deal with no args", () => {
    const runstring: ParsedRunstring = {
      tool: "test",
      from: "/some/sort/of/path",
      arguments: new Map(),
      autoAnswer: false,
      answers: [],
    };
    expect(generateRunstring(runstring)).toEqual(
      "tool:test;from:/some/sort/of/path;args:[];autoAnswer:f;answers:[]"
    );
  });
  test("should deal with answers", () => {
    const runstring: ParsedRunstring = {
      tool: "test",
      from: "/some/path/",
      arguments: new Map([
        ["a", "coolarg"],
        ["c", "23"],
      ]),
      autoAnswer: true,
      answers: ["y", "dothethng", "nah"],
    };
    expect(generateRunstring(runstring)).toEqual(
      "tool:test;from:/some/path/;args:[a:coolarg,c:23,];autoAnswer:t;answers:[y,dothethng,nah,]"
    );
  });
});

describe("parseRunstring", () => {
  test("should deal with no answers", () => {
    const runstring =
      "tool:test;from:/some/sort/of/path;args:[a:coolarg,c:23,];autoAnswer:f;answers:[]";
    const parsed = parseRunstring(runstring);

    expect(parsed.tool).toEqual("test");
    expect(parsed.from).toEqual("/some/sort/of/path");
    expect(parsed.arguments.get("a")).toEqual("coolarg");
    expect(parsed.arguments.get("c")).toEqual("23");
    expect(parsed.autoAnswer).toEqual(false);
    expect(parsed.answers).toEqual([]);
  });
  test("should deal with no args", () => {
    const runstring =
      "tool:test;from:/some/sort/of/path;args:[];autoAnswer:f;answers:[]";
    const parsed = parseRunstring(runstring);

    expect(parsed.tool).toEqual("test");
    expect(parsed.from).toEqual("/some/sort/of/path");
    expect(parsed.arguments.size).toEqual(0);
    expect(parsed.autoAnswer).toEqual(false);
    expect(parsed.answers).toEqual([]);
  });
  test("should deal with answers", () => {
    const runstring =
      "tool:test;from:/some/path/;args:[a:coolarg,c:23,];autoAnswer:t;answers:[y,dothethng,nah,]";
    const parsed = parseRunstring(runstring);

    expect(parsed.tool).toEqual("test");
    expect(parsed.from).toEqual("/some/path/");
    expect(parsed.arguments.get("a")).toEqual("coolarg");
    expect(parsed.arguments.get("c")).toEqual("23");
    expect(parsed.autoAnswer).toEqual(true);
    expect(parsed.answers).toEqual(["y", "dothethng", "nah"]);
  });
});
