import { create_feed, get_feeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/user";
import { Feed, User } from "../lib/db/schema";
import { printFeedFollow } from "./feed-follows";
import { createFeedFollow } from "../lib/db/queries/feed-follows";

export async function addFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    console.log(`usage: ${cmdName} <feed_name> <url>`);
  }

  let namefeed = args[0];
  let urlfeed = args[1];

  let feed = await create_feed(namefeed, urlfeed, user.id);

  if (!feed) {
    throw new Error("Failed to create feed");
  }

  let feedFollow = await createFeedFollow(urlfeed, user.id);


  printFeedFollow(user.name, feedFollow.feedName);
  printFeed(feed, user);
}

export async function handlerFeeds() {
  let feeds = await get_feeds();

  for (let feed of feeds) {
    let user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log(`====================================`);
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
