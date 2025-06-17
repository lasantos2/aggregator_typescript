import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  console.log("Fuck");
  const [results] = await db.insert(users).values({ name: name }).returning();
  if (results === undefined) {
    throw new Error("Someshit happened");
  }
  console.log("Finished probably");
  console.log(results.name);
  return results;
}

//export async function getUser(name: string) {
//  const [results] = await db.select().from(users).where(eq(users.name, name));
//  return results;
//}
