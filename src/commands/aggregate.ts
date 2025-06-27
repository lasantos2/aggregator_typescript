import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { parseDuration } from "../lib/time";
import { fetchFeed } from "../lib/rss";
import { Feed } from "../lib/db/schema";
import process from "process";

export async function handlerAgg(_: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Need only 1 parameter <interval> in ms|min|hr");
  }
  let interval = args[0];
  console.log(`Setting interval of : ${interval}`);

  let convertedInterval = parseDuration(interval);

  scrapeFeeds().catch(handleError);

  const intervalObject = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, convertedInterval);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(intervalObject);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  //    Get the next feed to fetch from the DB.
  let nextFeed = await getNextFeedToFetch();
  //Mark it as fetched.

  if (!nextFeed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  scrapeFeed(nextFeed);
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function handleError(err: unknown) {
  console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}
