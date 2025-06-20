import { setUser } from "./config.js";
import { readConfig } from "./config.js";
import {
  createUser,
  deleteUsers,
  showUsers,
  getUser,
} from "./lib/db/queries/user.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }
  const name = args[0];

  let userExist = await getUser(name);

  if (userExist.name !== name) {
    console.log(
      `User: ${name} does not exist in database, register user first`,
    );
  }
  setUser(userExist.name);

  console.log("User has been set");
}

export async function handlerError(error: Error) {
  console.log(error.message);
  throw error;
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
