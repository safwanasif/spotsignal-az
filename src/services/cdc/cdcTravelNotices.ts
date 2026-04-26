export interface CdcTravelNotice {
  title: string;
  link: string;
  publishedAt: string;
}

const CDC_TRAVEL_RSS_URL = "https://wwwnc.cdc.gov/travel/rss/notices.xml";

function textOf(item: Element, tagName: string): string {
  return item.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? "";
}

export async function fetchCdcTravelNotices(limit = 5): Promise<CdcTravelNotice[]> {
  const response = await fetch(CDC_TRAVEL_RSS_URL);

  if (!response.ok) {
    throw new Error(`CDC travel RSS failed with ${response.status}`);
  }

  const xml = await response.text();
  const document = new DOMParser().parseFromString(xml, "application/xml");
  const items = Array.from(document.getElementsByTagName("item"));

  return items.slice(0, limit).map((item) => ({
    title: textOf(item, "title"),
    link: textOf(item, "link"),
    publishedAt: textOf(item, "pubDate")
  }));
}
