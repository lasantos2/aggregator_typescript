import { setUser } from "./config.js";
import { readConfig } from "./config.js";
import {
  create_feed,
  createFeeedFollow,
  get_feeds,
  getFeedByUrl,
  getFeedFollowsForUser,
} from "./lib/db/queries/feeds.js";
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

export async function handlerFollow(commandName: string, ...args: string[]) {
  console.log("following feed");
  console.log("TODO: NOT IMPLEMENTED");

  let followfeedUrl = args[0];
  // check if feed exists in database
  let feedExist =
    (await getFeedByUrl(followfeedUrl)) !== undefined ? true : false;

  if (!feedExist) {
    console.log("Feed does not exist in db");
    return;
  }
  // create new feed follow record
  let result = createFeeedFollow();
  // look up feeds by url

  // print name of feed and current user if record created
  let config = readConfig();

  console.log(config.current_user_name);

  return;
}

export async function handlerFollowing(commandName: string, ...args: string[]) {
  let config = readConfig();

  let user = await getUserByName(config.current_user_name);
  // get feeds the current user is following
  let feeds = await getFeedFollowsForUser(user.id);

  console.log("TODO: NOT FINISHED IMPLEMENTING");
  if (feeds.length <= 0) {
    console.log("No feeds received");
    return;
  }
}
