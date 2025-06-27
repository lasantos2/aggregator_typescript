import { sql } from "drizzle-orm";
import { db } from "..";
import { Post, posts } from "../schema";

export async function createPost(feedId: string, postTitle: string) {
  //  const [newPost] = await db
  //    .insert(posts)
  //    .values({
  //    })
  //    .returning();
  //
  //  const [result] = await db
  //    .select({
  //      id: feedFollows.id,
  //      createdAt: feedFollows.createdAt,
  //      updatedAT: feedFollows.updatedAt,
  //      userId: feedFollows.userId,
  //      feedId: feedFollows.feedId,
  //      feedName: feeds.name,
  //      userName: users.name,
  //    })
  //    .from(feedFollows)
  //    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
  //    .innerJoin(users, eq(feedFollows.userId, users.id))
  //    .where(
  //      and(
  //        eq(feedFollows.id, newFeedFollow.id),
  //        eq(users.id, newFeedFollow.userId),
  //      ),
  //    );
  //
  return {};
}

export async function getPostsForUser(postLimit: number) {

  const results = await db
    .select()
    .from(posts)
    .orderBy(sql`${posts.published_at} desc nulls first`)
    .limit(postLimit);

  return results;
}
