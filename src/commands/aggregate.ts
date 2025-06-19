import { fetchFeed } from "../rssfetch";

export async function handlerAgg() {
  let result = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(result);
}
