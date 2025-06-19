import { User } from "../lib/db/schema";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

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

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;
