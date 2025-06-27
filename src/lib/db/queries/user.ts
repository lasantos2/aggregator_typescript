import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {
  const [results] = await db.insert(users).values({ name: name }).returning();
  return results;
}

export async function getUser(name: any) {
  const results = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(results);
}

export async function getUserById(userId: any) {
  const [result] = await db.select().from(users).where(eq(users.id, userId));
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUsers() {
  const results = await db.select().from(users);
  return results;
}
