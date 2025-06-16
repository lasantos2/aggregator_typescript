import { setUser } from "./config.js";
import { createUser, getUser } from "./lib/db/queries/user.js";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }

  setUser(args[0]);

  console.log("User has been set");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }

  console.log(args);

  let result = await getUser(args[0]);

  if (result.name === args[0]) {
    console.log("user already exists");
    return;
  }

  let status = await createUser(args[0]);

  setUser(status.name);
  console.log("created User");
}

export type CommandRegistry = Record<string, CommandHandler>;

export async function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  registry[cmdName](cmdName, ...args);
}
