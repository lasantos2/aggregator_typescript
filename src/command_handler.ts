import { setUser } from "./config.js";
import { readConfig } from "./config.js";
import { create_feed, get_feeds } from "./lib/db/queries/feeds.js";
import {
  createUser,
  deleteUsers,
  showUsers,
  getUserByName,
  getUserById,
} from "./lib/db/queries/user.js";

import { fetchFeed } from "./rssfetch.js";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }
  const name = args[0];

  let userExist = await getUserByName(name);

  if (userExist.name !== name) {
    console.log(
      `User: ${name} does not exist in database, register user first`,
    );
  }
  setUser(userExist.name);

  console.log("User has been set");
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  let result = await deleteUsers();

  console.log("Users deleted");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }

  let name = args[0];
  let status: any;
  console.log(`trying to register ${name}`);

  try {
    status = await createUser(name);
  } catch (error: any) {
    throw new Error("User already exists");
  }
  setUser(status.name);
  console.log("created User");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  try {
    let users = await showUsers();
    for (let user of users) {
      if (user.name === readConfig().current_user_name) {
        console.log(` - ${user.name} (current)`);
      } else {
        console.log(` - ${user.name}`);
      }
    }
  } catch (error: any) {
    throw new Error("No users");
  }
}

export async function handlerAgg() {
  let result = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(result);
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

export async function addFeed(commandName: string, ...args: string[]) {
  if (args.length <= 0) {
    console.log("Need two parameters");
  }

  let namefeed = args[0];
  let urlfeed = args[1];

  let currentConfig = readConfig();

  let current_user = currentConfig.current_user_name;

  let currentUserId = (await getUserByName(current_user)).id;

  let feedInfo = await fetchFeed(urlfeed);
  if (feedInfo === undefined) {
    console.log(`Unable to fetch feed from : ${urlfeed}`);
    return;
  }

  let result = await create_feed(namefeed, urlfeed, currentUserId);

  if (result === undefined) {
    console.log("Unable to fetch feed");
    return;
  }

  console.log("feed created");
}

export async function handlerFeeds() {
  let feeds = await get_feeds();

  for (let feed of feeds) {
    let user = await getUserById(feed.user_id);
    console.log(feed.name);
    console.log(user.name);
  }

  return;
}
