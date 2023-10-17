import { ApplicationFiles } from "./application-files";
import YAML from "yaml";
import * as fs from "node:fs";
import { FancyOut } from "@pwrtool/fancy-out";

export interface KitInfo {
  name: string;
  author: string;
  description: string;
  repo: string;
  tools: ToolInfo[];
  config: PropertyInfo[];
}

type ToolInfo = {
  name: string;
  description: string;
  arguments: PropertyInfo[];
  usesQuestions: boolean;
};

type PropertyInfo = {
  key: string;
  possibleValues: any[];
  description: string;
};

const files = new ApplicationFiles();

export function getKitInfo(kit: string): KitInfo | string {
  const kitDir = `${files.kitsDir}/${kit.replace("/", ">")}`;
  const infoFile = `${kitDir}/ptinfo.yaml`;

  if (fs.existsSync(infoFile) === false) {
    return "Kit was not found or does not contain a ptinfo.yaml file";
  }

  let parsedInfo: KitInfo;
  try {
    parsedInfo = YAML.parse(fs.readFileSync(infoFile, "utf8"));
  } catch (e) {
    return "Kit failed to be parsed";
  }

  return parsedInfo;
}

export function outputKitInfo(kitInfo: KitInfo, kit: string) {
  FancyOut.header(`Help Screen for ${kit}`);
  FancyOut.out(`Author: ${kitInfo.author}`);
  FancyOut.out(`Description: ${kitInfo.description}`);
  FancyOut.out(`Repo: ${kitInfo.repo}`);

  FancyOut.underlined("\nTools:");
  kitInfo.tools.forEach((tool) => {
    // we learned our lesson about using left-pad
    FancyOut.out(`  ${tool.name} - ${tool.description}`);
    FancyOut.out(
      `    Arguments: ${tool.arguments.map((arg) => arg.key).join(", ")}`,
    );
    FancyOut.out(`    Uses Questions: ${tool.usesQuestions}`);
  });

  if (kitInfo.config.length > 0) {
    FancyOut.underlined("\nConfig Values:");
    kitInfo.config.forEach((property) => {
      FancyOut.out(`  ${property.key} - ${property.description}`);
      FancyOut.out(
        `    Possible Values: ${property.possibleValues.join(", ")}`,
      );
    });
  }
}
