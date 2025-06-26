import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  current_user_name: string;
};

export function setUser(username: string) {
  // writes config object to json file after stting current user name field
  let oldconfig = readConfig();
  let config: Config = { current_user_name: username, dbUrl: oldconfig.dbUrl };

  writeConfig(config);
}

export function readConfig(): Config {
  let file = getConfigPath();
  let configContent = fs.readFileSync(file, { encoding: "utf-8" });

  let configjson = JSON.parse(configContent);

  return validateConfig(configjson);
}

function getConfigPath(): string {
  return path.join(os.homedir(), "/.gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  let fileToWrite = getConfigPath();

  fs.writeFileSync(fileToWrite, JSON.stringify(cfg), { encoding: "utf-8" });
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.dbUrl || typeof rawConfig.dbUrl !== "string") {
    throw new Error(`db_url is required in config file`)
  }
  if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    current_user_name: rawConfig.current_user_name,
  };

  return config;
}
