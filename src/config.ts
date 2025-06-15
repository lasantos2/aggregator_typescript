import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  current_user_name: string;
};

export function setUser(config: Config) {
  // writes config object to json file after stting current user name field

  writeConfig(config);
}

export function readConfig(): Config {
  let file = getConfigPath();
  let configContent = fs.readFileSync(file, { encoding: "utf-8" });

  let configjson = JSON.parse(configContent);

  let config: Config = {
    current_user_name: configjson["current_user_name"],
    dbUrl: configjson["dbUrl"],
  };

  return config as Config;
}

function getConfigPath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  let fileToWrite = getConfigPath();

  fs.writeFileSync(fileToWrite, JSON.stringify(cfg));
}

function validateConfig(rawConfig: any): Config {
  return {} as Config;
}
