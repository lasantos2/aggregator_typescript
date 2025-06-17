import {
  CommandRegistry,
  CommandHandler,
  registerCommand,
  runCommand,
  handlerLogin,
  handlerRegister,
} from "./command_handler.js";

import argv from "process";
import process from "process";

async function main() {
  let cmndRegis: CommandRegistry = {
    login: {} as CommandHandler,
    register: {} as CommandHandler,
  };

  registerCommand(cmndRegis, "login", handlerLogin);
  registerCommand(cmndRegis, "register", handlerRegister);

  let commands = argv["argv"].slice(2);

  if (commands.length <= 0) {
    console.log("Must enter atleast one command");
    return process.exit(1);
  }

  let commandName = commands[0];
  let args = commands.slice(1);

  try {
    runCommand(cmndRegis, commandName, ...args);
  } catch (error: any) {
    console.log(error.message);
    return process.exit(1);
  }

  process.exit(0);
}

main();
