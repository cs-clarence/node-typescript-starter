import process from "process";
import program from "./program.mjs";
import readline from "readline";

if (process.platform === "win32") {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

program.parse(process.argv);
