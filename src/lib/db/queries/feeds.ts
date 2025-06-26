import { eq, and, asc, sql } from "drizzle-orm";
import { db } from "..";
import { Feed, feed_follows, feeds } from "../schema";
import { users } from "../schema";

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

export async function getFeedById(feed_id: any) {
  try {
    const feed = await db.select().from(feeds).where(eq(feeds.id, feed_id));
    return feed;
  } catch (error: any) {
    throw new Error("failed to find feed");
  }
}

export async function createFeeedFollow(feed_id: string, user_id: string) {
  console.log("Creating feed follow record");

  const [newFeedFollow] = await db
    .insert(feed_follows)
    .values({ feed_id, user_id })
    .returning();

  const [result] = await db
    .select({
      id: feed_follows.id,
      createdAt: feed_follows.createdAt,
      updatedAt: feed_follows.updatedAt,
      user_id: feed_follows.user_id,
      feed_id: feed_follows.feed_id,
      feed_name: feeds.name,
      user_name: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id)),
    .innerJoin(users, eq(feed_follows.user_id, users.id)),
    .where(
      and(
        eq(feed_follows.id, newFeedFollow.id),
        eq(users.id, newFeedFollow.user_id),
      ),
    );

  return feed;
}

export async function getFeedFollowsForUser(userid: any) {
  let feeds = await db
    .select()
    .from(feed_follows)
    .where(eq(feed_follows.user_id, userid));

  return feeds;
}
export async function unfollowFeed(userid: any, url: string) {
  let [results] = await db
    .delete(feed_follows)
    .where(and(eq(feed_follows.user_id, userid), eq(feed_follows.url, url)));
  return results;
}

export async function markFeedFetched(feed_id: any) {
  let feed = getFeedById(feed_id);
  if (!feed) {
    throw new Error("feed does not exist to mark as fetched");
  }

  try {
    let update = db
      .update(feeds)
      .set({
        updatedAt: new Date(),
        last_fetched_at: new Date(),
      })
      .where(eq(feeds.id, feed_id))
      .returning();
    return update;
  } catch (error: any) {
    throw new Error("Update failed");
  }
}

export async function getNextFeedToFetch() {
  let [feedToFetch] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} desc nulls first`);

  return feedToFetch;
}
