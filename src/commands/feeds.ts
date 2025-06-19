import { create_feed, get_feeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/user";
import { Feed, User } from "../lib/db/schema";
import { createFeeedFollow } from "../lib/db/queries/feeds";
import { fetchFeed } from "../rssfetch";

export async function addFeed(_: string, user: User, ...args: string[]) {
  if (args.length <= 0) {
    console.log("Need two parameters");
  }

  let namefeed = args[0];
  let urlfeed = args[1];

  let feedInfo = await fetchFeed(urlfeed);
  if (feedInfo === undefined) {
    console.log(`Unable to fetch feed from : ${urlfeed}`);
    return;
  }

  let result = await create_feed(namefeed, urlfeed, user.id);

  if (result === undefined) {
    console.log("Unable to fetch feed");
    return;
  }

  console.log("feed created");

  let [results] = await createFeeedFollow(urlfeed, user.id);

  console.log(results.feeds.name);
  console.log(user.name);
}

export async function handlerFeeds() {
  let feeds = await get_feeds();

  for (let feed of feeds) {
    let user = await getUserById(feed.user_id);
    console.log(feed.name);
    console.log(user.name);
  }

  return;
}
