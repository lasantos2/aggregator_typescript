import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
}


export function setUser() {

}

export function readConfig(configPath: string): Config {
  let configpath = os.homedir() + "/.gatorconfig.json"
  if (configPath !== "" | undefined) {
    configpath = configPath;
  }



}

function getConfigPath(): string {

}

function writeConfig(cfg: Config): void {

}

// Used by readConfig to validate JSON.parse
function validateConfig(rawConfig: any): Config {

}
