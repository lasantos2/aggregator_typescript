import {
  CommandHandler,
  CommandRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import {
  handlerReset,
  handlerLogin,
  handlerRegister,
  handlerUsers,
} from "./command_handler.js";
import { addFeed, handlerFeeds } from "./commands/feeds.js";
import {
  handlerFollowing,
  handlerFollow,
  handlerDeleteFollow,
} from "./commands/feed-follows.js";
import { middlewareLoggedIn } from "./middleware.js";
import { handlerAgg } from "./commands/aggregate.js";

import { argv } from "process";
import process from "process";

async function main() {
  let cmndRegis: CommandRegistry = {
    login: {} as CommandHandler,
    register: {} as CommandHandler,
    reset: {} as CommandHandler,
    agg: {} as CommandHandler,
    addFeed: {} as CommandHandler,
    feeds: {} as CommandHandler,
    follow: {} as CommandHandler,
    following: {} as CommandHandler,
  };

  let regi = await registerCommand(cmndRegis, "login", handlerLogin);
  regi = await registerCommand(cmndRegis, "register", handlerRegister);
  regi = await registerCommand(cmndRegis, "reset", handlerReset);
  regi = await registerCommand(cmndRegis, "users", handlerUsers);
  regi = await registerCommand(cmndRegis, "agg", handlerAgg);
  regi = await registerCommand(
    cmndRegis,
    "addfeed",
    middlewareLoggedIn(addFeed),
  );
  regi = await registerCommand(cmndRegis, "feeds", handlerFeeds);
  regi = await registerCommand(
    cmndRegis,
    "follow",
    middlewareLoggedIn(handlerFollow),
  );
  regi = await registerCommand(
    cmndRegis,
    "following",
    middlewareLoggedIn(handlerFollowing),
  );

  regi = await registerCommand(
    cmndRegis,
    "unfollow",
    middlewareLoggedIn(handlerDeleteFollow),
  );

  let commands = argv.slice(2);

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
