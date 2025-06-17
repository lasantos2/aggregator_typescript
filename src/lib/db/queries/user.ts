import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  try {
    const [results] = await db.insert(users).values({ name: name }).returning();
    return results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log("Finished probably");
}

export async function getUser(name: string) {
  const [results] = await db.select().from(users).where(eq(users.name, name));
  return results;
}
