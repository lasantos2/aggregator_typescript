import type { RSSFeed, RSSItem } from "rss.js";
import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedUrl: string) {
  //console.log(feedUrl);
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

  let title: string = rssfeed.rss.channel.title;
  let link: string = rssfeed.rss.channel.link;
  let description: string = rssfeed.rss.channel.description;
  let items: Object[];

  if (Array.isArray(rssfeed.rss.channel.item)) {
    items = [];
    for (let item of rssfeed.rss.channel.item) {
      let title = item.title;
      let link = item.link;
      let desc = item.description;
      let pubdate = item.pubDate;

      if (
        title === undefined ||
        link === undefined ||
        desc === undefined ||
        pubdate === undefined
      ) {
        continue;
      } else {
        items.push({ title, link, desc, pubdate });
      }
    }
  } else {
    items = [];
  }

  let rsfeedobj: RSSFeed;
  rsfeedobj = {
    title: title,
    link: link,
    description: description,
    item: items,
  };

  return rsfeedobj;
}
