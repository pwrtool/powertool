import { io } from "..";

const answer = await io.prompt<string>("What is your name?");
io.out(answer);
