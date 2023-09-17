export function usefulArgs(): string[] {
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].includes("ptx.ts") || process.argv[i] === "ptx") {
      return process.argv.slice(i + 1);
    }
  }

  return [];
}
