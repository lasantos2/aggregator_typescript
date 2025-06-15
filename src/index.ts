import { Config, setUser, readConfig } from "./config.js";

function main() {
  let config = {} as Config;
  config.current_user_name = "currentUserName";
  config.dbUrl = "postgres://example";

  setUser(config);
  let readconfig = readConfig();

  console.log(`${readconfig.current_user_name}`);
  console.log(`dbUrl `);
  console.log(`${readconfig.dbUrl}`);
}

main();
