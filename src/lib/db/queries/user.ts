import {db} from ".."
import {users} from "../schema";

export async function createUser(name: string) {
  const [results] = await db.insert(users).values({name:name}).returning();
  return results;
}
