import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { fetchFeed } from "../rssfetch";
import { parseDuration } from "../lib/time";
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

function handleError(err: unknown) {
  console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}
