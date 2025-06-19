import { User } from "../lib/db/schema";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import {
  createFeeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feeds";

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
  let [result] = await createFeeedFollow(followfeedUrl, user.id);

  // print name of feed and current user if record created
  if (result === undefined) return;

  console.log(result.feeds.name);
  console.log(user.name);

  return;
}

export async function handlerFollowing(_: string, user: User) {
  // get feeds the current user is following
  let feeds = await getFeedFollowsForUser(user.id);

  if (feeds.length <= 0) {
    return;
  }

  for (let feed of feeds) {
    console.log(`${feed.name}`);
  }
}
