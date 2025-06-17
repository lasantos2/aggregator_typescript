import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  try {
    const [results] = await db.insert(users).values({ name: name }).returning();
    return results;
  } catch (error) {
    throw new Error("Lol");
  }
}

export async function getUser(name: string) {
  const [results] = await db.select().from(users).where(eq(users.name, name));
  return results;
}

export async function deleteUsers() {
  const [results] = await db.delete(users);
  return results;
}

export async function showUsers() {
  const results = await db.select().from(users);
  return results;
}
