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
  const name = args[0];

  let userExist = await getUser(name);

  if (userExist.name !== name) {
    console.log(
      `User: ${name} does not exist in database, register user first`,
    );
    return new Error("User does not exist");
  }
  setUser(userExist.name);

  console.log("User has been set");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }

  let name = args[0];
  let status: any;
  console.log(`trying to register ${name}`);
  status = await createUser(name);

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
  await registry[cmdName](cmdName, ...args);
}
