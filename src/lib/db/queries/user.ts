import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../../../schema.js";

export async function createUser(name: string) {
  console.log(name);
  console.log(db);
  const [results] = await db.insert(users).values({ name }).returning();
  console.log(results);
  return results;
}

export async function getUser(name: string) {
  const [results] = await db.select().from(users).where(eq(users.name, name));
  return results;
}
