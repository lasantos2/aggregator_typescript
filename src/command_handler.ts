import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }

  setUser(args[0]);

  console.log("User has been set");
}

export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  registry[cmdName](cmdName, ...args);
}
