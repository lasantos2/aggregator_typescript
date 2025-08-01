import {
  CommandHandler,
  CommandRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  handlerUsers,
} from "./commands/users";
import { addFeed, handlerFeeds } from "./commands/feeds";
import {
  handlerFollowing,
  handlerFollow,
  handlerDeleteFollow,
} from "./commands/feed-follows";
import { middlewareLoggedIn } from "./middleware";
import { handlerAgg } from "./commands/aggregate";
import { handlerReset } from "./commands/reset";

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

  let commands = process.argv.slice(2);

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
