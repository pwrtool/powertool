import { io } from "../index";

io.prompt<string>("What is your name?").then((name) => {
  console.log(`Hello ${name}!`);
});
