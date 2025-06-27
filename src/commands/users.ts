import { setUser, readConfig } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/user";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }
  const name = args[0];

  let userExist = await getUser(name);

  if (!userExist) {
    throw new Error(`User ${name} does not exist`);
  }

  setUser(userExist.name);

}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Expect a single argument: username");
  }

  let name = args[0];
  const status = await createUser(name);
  if (!status) {
    throw new Error(`User ${name} not found`);
  }
  setUser(status.name);
  console.log("created User");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  let users = await getUsers();
  for (let user of users) {
    if (user.name === readConfig().current_user_name) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
