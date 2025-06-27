import { eq, and, asc, sql } from "drizzle-orm";
import { db } from "..";
import { Feed, feedFollows, feeds } from "../schema";
import { users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function create_feed(
  feedname: string,
  feedurl: string,
  userId: any,
) {
  const results = await db
    .insert(feeds)
    .values({
      name: feedname,
      url: feedurl,
      userId,
    })
    .returning();
  return firstOrUndefined(results);
}

export async function get_feeds() {
  const results = await db.select().from(feeds);
  return results;
}

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function getFeedById(feed_id: any) {
  const result = await db.select().from(feeds).where(eq(feeds.id, feed_id));
  return firstOrUndefined(result);
}



export async function markFeedFetched(feed_id: any) {
  const result = await db
    .update(feeds)
    .set({
      lastFetchAt: new Date(),
    })
    .where(eq(feeds.id, feed_id))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  let result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchAt} desc nulls first`)
    .limit(1);

  return firstOrUndefined(result);
}
