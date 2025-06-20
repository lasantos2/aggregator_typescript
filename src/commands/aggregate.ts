import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { fetchFeed } from "../rssfetch";
import { User } from "../lib/db/schema";

export async function handlerAgg(_: string, ...args: string[]) {
  //  console.log("Trying to fetch next feed to fetch");
  // lets test getNextFeedToFetch first
  //  let nextFeed = await getNextFeedToFetch();
  //  console.log(nextFeed);

  //  let markfetched = await markFeedFetched(nextFeed.id);
  //  console.log(markfetched);
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Need only 1 parameter <interval> in ms|min|hr");
  }
  let interval = args[0];
  console.log(`Setting interval of : ${interval}`);

  let convertedInterval = parseDuration(interval);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, convertedInterval);
}

export async function scrapeFeeds() {
  //    Get the next feed to fetch from the DB.
  let nextFeed = await getNextFeedToFetch();
  //Mark it as fetched.
  let markedFeed = await markFeedFetched(nextFeed.id);
  if (markedFeed === undefined) {
    throw new Error("No feed to mark");
  }
  //Fetch the feed using the URL (we already wrote this function)
  //Iterate over the items in the feed and print their titles to the console.
  let fetchedFeed = await fetchFeed(nextFeed.url);

  for (let item of fetchedFeed.item) {
    if (item.title === undefined) continue;
    console.log(item.title);
  }
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  return 0;
}
