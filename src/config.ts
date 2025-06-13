import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
}


export function setUser() {

}

export function readConfig(configPath: string): Config {


}

function getConfigPath(): string {

}

function writeConfig(cfg: Config): void {

}

// Used by readConfig to validate JSON.parse
function validateConfig(rawConfig: any): Config {

}
