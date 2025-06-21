import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { fetchFeed } from "../rssfetch";
import process from "process";

export async function handlerAgg(_: string, ...args: string[]) {
  if (args.length <= 0 || args.length > 1) {
    throw new Error("Need only 1 parameter <interval> in ms|min|hr");
  }
  let interval = args[0];
  console.log(`Setting interval of : ${interval}`);

  let convertedInterval = parseDuration(interval);

  const intervalObject = setInterval(async () => {
    await scrapeFeeds();
    console.log();
  }, convertedInterval);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(intervalObject);
      resolve();
    });
  });

  for (;;) {}
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

  if (match === undefined) throw new Error("Need the right format");
  let millisecondstosecond = 1000; //1000ms for 1 second
  let convertedValue: number = 0;
  switch (match?.[2]) {
    case "ms":
      convertedValue = Number(match?.[1]);
      break;
    case "s":
      convertedValue = Number(match?.[1]) * millisecondstosecond;
      break;
    case "m":
      convertedValue = Number(match?.[1]) * 60 * millisecondstosecond;
      break;
    case "h":
      convertedValue = Number(match?.[1]) * 60 * 60 * millisecondstosecond;
      break;
  }

  return convertedValue;
}
