import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};


export async function fetchFeed(feedUrl: string) {
  const header = new Headers();

  header.append("User-Agent", "gator");
  let resp = await fetch(feedUrl, {
    method: "GET",
    headers: header,
  });

  if (!resp.ok) {
    console.log("xml fail");
  }

  let parser = new XMLParser();

  let rssfeed = parser.parse(await resp.text());

  const channel = rssfeed.rss?.channel;

  if (rssfeed.rss.channel === undefined) {
    throw new Error("rss.channel does not exist");
  }

  if (rssfeed.rss.channel.title === undefined) {
    throw new Error("rss.channel.title does not exist");
  }

  if (rssfeed.rss.channel.link === undefined) {
    throw new Error("rss.channel.link does not exist");
  }

  if (rssfeed.rss.channel.description === undefined) {
    throw new Error("rss.channel.description does not exist");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item : [channel.item];


  const rssItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const rss: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rss;
}
