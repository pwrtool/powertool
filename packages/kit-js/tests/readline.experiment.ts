import { exitWithSuccess, io } from "..";

const answer = await io.dichotomous("Do you like this?");
const anotherAnswer = await io.prompt("What is your name?");
console.log(answer);
io.out("Hello, " + anotherAnswer + "!");
io.out("Hello, " + anotherAnswer + "!");
exitWithSuccess();
