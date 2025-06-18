import { eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds } from "../schema";
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

export async function createFeeedFollow() {
  console.log("Creating feed follow record");
  let newFeedFollow = await db.insert(feed_follows);

  let feedfollowmeta = await db
    .select({
      id: feed_follows.id,
      createdAt: feed_follows.createdAt,
      updatedAt: feed_follows.updatedAt,
    })
    .from(feed_follows);

  let feedsmeta = await db
    .select({ id: feeds.id, name: feeds.name })
    .from(feeds);

  let usersmeta = await db
    .select({ id: users.id, name: users.name })
    .from(users);

  //const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
  let Owo = db
    .select()
    .from(feed_follows)
    .innerJoin(feeds, eq(feeds.id, feed_follows.feed_id))
    .innerJoin(users, eq(users.id, feed_follows.user_id));

  return Owo;
}

export async function getFeedFollowsForUser(userid: any) {
  let feeds = await db
    .select()
    .from(feed_follows)
    .where(eq(feed_follows.user_id, userid));

  return feeds;
}
