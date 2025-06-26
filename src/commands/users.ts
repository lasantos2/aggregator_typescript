import { setUser, readConfig } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/user";

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
    let users = await getUsers();
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
