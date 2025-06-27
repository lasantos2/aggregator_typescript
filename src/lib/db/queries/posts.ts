import { posts } from "../schema";

export async function createPost(userId: string, feedId: string) {
  const [newPost] = await db
    .insert(posts)
    .values({ feedId, userId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(
      and(
        eq(feedFollows.id, newFeedFollow.id),
        eq(users.id, newFeedFollow.userId),
      ),
    );

  return result;
}
