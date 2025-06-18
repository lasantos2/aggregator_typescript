import {
  CommandRegistry,
  CommandHandler,
  registerCommand,
  runCommand,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  handlerAgg,
} from "./command_handler.js";

import argv from "process";
import process from "process";

async function main() {
  let cmndRegis: CommandRegistry = {
    login: {} as CommandHandler,
    register: {} as CommandHandler,
    reset: {} as CommandHandler,
    agg: {} as CommandHandler,
  };

  let regi = await registerCommand(cmndRegis, "login", handlerLogin);
  regi = await registerCommand(cmndRegis, "register", handlerRegister);
  regi = await registerCommand(cmndRegis, "reset", handlerReset);
  regi = await registerCommand(cmndRegis, "users", handlerUsers);
  regi = await registerCommand(cmndRegis, "agg", handlerAgg);

  let commands = argv["argv"].slice(2);

  if (commands.length <= 0) {
    console.log("Must enter atleast one command");
    return process.exit(1);
  }

  let commandName = commands[0];
  let args = commands.slice(1);

  try {
    await runCommand(cmndRegis, commandName, ...args);
  } catch (error: any) {
    return process.exit(1);
  }

  process.exit(0);
}

main();
