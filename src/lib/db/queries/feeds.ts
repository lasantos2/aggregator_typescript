import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export async function create_feed(
  feedname: string,
  feedurl: string,
  userId: any,
) {
  try {
    const [results] = await db
      .insert(feeds)
      .values({
        name: feedname,
        url: feedurl,
        user_id: userId,
      })
      .returning();
    return results;
  } catch (error) {
    throw new Error("Lol");
  }
}

export async function get_feeds() {
  try {
    const results = await db.select().from(feeds);
    return results;
  } catch (error: any) {
    throw new Error("Unable to fetch feeds: ", error);
  }
}

export async function getFeedByUrl(url: string) {
  try {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
  } catch (error: any) {
    throw new Error("feed does not exist in db");
  }
}

export async function createFeeedFollow() {
  console.log("Creating feed follow record");
  console.log("TODO: Not implemented");

  return;
}
