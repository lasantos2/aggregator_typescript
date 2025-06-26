import { deleteUsers } from "../lib/db/queries/user";

export async function handlerReset(cmdName: string, ...args: string[]) {
  await deleteUsers();
  console.log("Users deleted");
}
