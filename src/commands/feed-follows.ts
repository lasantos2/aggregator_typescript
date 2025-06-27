import { User } from "../lib/db/schema";
import { getFeedById, getFeedByUrl } from "../lib/db/queries/feeds";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";

export async function handlerFollow(_: string, user: User, ...args: string[]) {
  console.log("following feed");

  let followfeedUrl = args[0];
  // check if feed exists in database
  let feedExist =
    (await getFeedByUrl(followfeedUrl)) !== undefined ? true : false;

  if (!feedExist) {
    console.log("Feed does not exist in db");
    return;
  }
  let result = await createFeedFollow(followfeedUrl, user.id);

  // print name of feed and current user if record created
  if (result === undefined) return;

  printFeedFollow(result.userName, result.feedName);

}

export async function handlerFollowing(_: string, user: User) {
  // get feeds the current user is following
  let feeds = await getFeedFollowsForUser(user.id);

  if (feeds.length <= 0) {
    return;
  }

  for (let feed of feeds) {
    const feedrecord = await getFeedById(feed.feedId);
    console.log(`${feedrecord?.name}`);
  }
}

export async function handlerDeleteFollow(
  _: string,
  user: User,
  ...args: string[]
) {
  let url = args[0];

  let result = await deleteFeedFollow(user.id, url);

  console.log(`Unfollowed feed`);
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:         ${username}`);
  console.log(`* Feed:         ${feedname}`);
}
