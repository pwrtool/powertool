import { io } from "../index.js";

io.prompt<string>("What is your name?")
  .then((name: string) => {
    console.log(`Hello ${name}!`);
  })
  .catch((e: Error) => {
    console.error(e);
  });
