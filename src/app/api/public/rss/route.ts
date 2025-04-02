import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { z } from 'zod';
import pino from 'pino';

const logger = pino({ name: 'rss-api' });

const PODCAST_RSS_URL = 'https://www.neutral.us/podcast/rss.xml';
const BLOG_RSS_URL = 'https://www.neutral.us/learn/rss.xml';

// Cache duration (1 hour in seconds)
const CACHE_DURATION = 60 * 60;

const parser = new Parser<{
  item: {
    'media:content'?: Array<{$: {url: string}}>;
    mediaContent?: Array<{$: {url: string}}>;
    'itunes:image'?: {href: string};
    itunesImage?: {href: string};
    enclosure?: {url: string};
    content?: string;
    title?: string;
    link?: string;
    pubDate?: string;
    description?: string;
    itunes?: {image?: string};
  }
}>({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['itunes:image', 'itunesImage'],
      ['enclosure', 'enclosure'],
    ],
  },
});

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  imageUrl?: string;
  type: 'blog' | 'podcast';
}

let rssCache: {
  data: NewsItem[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

/**
 * Extract image URL from various possible RSS item properties
 */
function extractImageUrl(item: any, type: 'blog' | 'podcast'): string | undefined {
  // Try media:content
  if (item.mediaContent && item.mediaContent.length > 0) {
    for (const media of item.mediaContent) {
      if (media?.$ && media.$.url) {
        return media.$.url;
      }
    }
  }

  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  if (item.itunesImage && item.itunesImage.href) {
    return item.itunesImage.href;
  }

  if (type === 'podcast' && item.itunes && item.itunes.image) {
    return item.itunes.image;
  }

  const content = item.content || item.description || '';
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const imgMatch = content.match(imgRegex);
  if (imgMatch) {
    return imgMatch[1];
  }

  return undefined;
}

/**
 * Parse RSS feed and convert to NewsItem format
 */
async function parseRSSFeed(url: string, type: 'blog' | 'podcast'): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    
    return (feed.items || []).map(item => {
      return {
        title: item.title || 'Untitled',
        link: item.link || '#',
        pubDate: item.pubDate || new Date().toISOString(),
        description: item.contentSnippet || '',
        imageUrl: extractImageUrl(item, type),
        type,
      };
    });
  } catch (error) {
    logger.error({ error, url }, 'Error parsing RSS feed');
    return [];
  }
}

/**
 * Fetch and parse both RSS feeds, combining and sorting the results
 */
async function fetchAllRSSFeeds(): Promise<NewsItem[]> {
  try {
    // Check if cache is still valid (less than 1 hour old)
    const now = Math.floor(Date.now() / 1000);
    if (rssCache.data && now - rssCache.timestamp < CACHE_DURATION) {
      return rssCache.data;
    }

    const [blogItems, podcastItems] = await Promise.all([
      parseRSSFeed(BLOG_RSS_URL, 'blog'),
      parseRSSFeed(PODCAST_RSS_URL, 'podcast'),
    ]);

    const combinedItems = [...blogItems, ...podcastItems].sort((a, b) => {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

    rssCache = {
      data: combinedItems,
      timestamp: now,
    };

    return combinedItems;
  } catch (error) {
    logger.error({ error }, 'Error fetching RSS feeds');
    throw error;
  }
}

const querySchema = z.object({
  limit: z.coerce.number().optional().default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));

    const newsItems = await fetchAllRSSFeeds();

    const limitedItems = query.limit ? newsItems.slice(0, query.limit) : newsItems;

    return NextResponse.json(
      { data: limitedItems },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        },
      },
    );
  } catch (error) {
    logger.error({ error }, 'Error in RSS API route');
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}