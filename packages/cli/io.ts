export const io = {
  /**
   * Outputs a message to the console
   * @param message - The message to output
   * @return void
   */
  out: (message: string) => {
    console.log(message);
  },

  /**
   * Outputs a message to the console in green and bold text
   * @param message - The message to output
   * @return void
   */
  success: (message: string) => {
    console.log("\x1b[32;1m%s\x1b[0m", message);
  },

  /**
   * Outputs a message to the console in blue and bold text
   * @param message - The message to output
   * @return void
   */
  bold: (message: string) => {
    console.log("\x1b[37;1m%s\x1b[0m", message);
  },

  /**
   * Outputs a message to the console in yellow and bold text
   * @param message - The message to output
   * @return void
   */
  warn: (message: string) => {
    console.log("\x1b[33;1m%s\x1b[0m", message);
  },

  /**
   * Outputs a message to the console in bold blue text with an underline
   * @param message - The message to output
   * @return void
   */
  header: (message: string) => {
    console.log("\x1b[34;1;4m%s\x1b[0m", message);
  },

  /**
   * Outputs a message to the console in red and bold text
   * @param message - The message to output
   * @return void
   */
  error: (message: string) => {
    console.log("\x1b[31;1m%s\x1b[0m", message);
  },
};
