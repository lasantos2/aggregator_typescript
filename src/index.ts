import {
  CommandHandler,
  CommandRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerReset,
  handlerLogin,
  handlerRegister,
  handlerUsers,
} from "./commands/commands";
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

  let regi = registerCommand(cmndRegis, "login", handlerLogin);
  regi = registerCommand(cmndRegis, "register", handlerRegister);
  regi = registerCommand(cmndRegis, "reset", handlerReset);
  regi = registerCommand(cmndRegis, "users", handlerUsers);
  regi = registerCommand(cmndRegis, "agg", handlerAgg);
  regi = registerCommand(
    cmndRegis,
    "addfeed",
    middlewareLoggedIn(addFeed),
  );
  regi = registerCommand(cmndRegis, "feeds", handlerFeeds);
  regi = registerCommand(
    cmndRegis,
    "follow",
    middlewareLoggedIn(handlerFollow),
  );
  regi = registerCommand(
    cmndRegis,
    "following",
    middlewareLoggedIn(handlerFollowing),
  );

  regi = registerCommand(
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
