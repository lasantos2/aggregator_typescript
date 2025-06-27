import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  current_user_name: string;
};

export function setUser(username: string) {
  const config = readConfig();
  config.current_user_name = username;
  writeConfig(config);
}

export function readConfig() {
  let file = getConfigPath();
  let configContent = fs.readFileSync(file, "utf-8");
  let configjson = JSON.parse(configContent);
  return validateConfig(configjson);
}

function getConfigPath(): string {
  return path.join(os.homedir(), "/.gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  let fileToWrite = getConfigPath();

  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.current_user_name,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fileToWrite, data, { encoding: "utf-8" });
}

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
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
