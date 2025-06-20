import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { fetchFeed } from "../rssfetch";
import { User } from "../lib/db/schema";

export async function handlerAgg(_: string, ...args: string[]) {
  console.log();

  console.log("Trying to fetch next feed to fetch");
  // lets test getNextFeedToFetch first
  let nextFeed = await getNextFeedToFetch();
  console.log(nextFeed);

  let markfetched = await markFeedFetched(nextFeed.id);
  console.log(markfetched);
}

export async function scrapeFeeds(_: string, user: User) {
  //    Get the next feed to fetch from the DB.
  let nextFeed = await getNextFeedToFetch();
  //Mark it as fetched.
  let [markedFeed] = await markFeedFetched(user.id);
  if (markedFeed === undefined) {
    throw new Error("No feed to mark");
  }
  //Fetch the feed using the URL (we already wrote this function)
  //Iterate over the items in the feed and print their titles to the console.
  let fetchedFeed = await fetchFeed(nextFeed.url);

  for (let item of fetchedFeed) {
    console.log(item);
  }
}
