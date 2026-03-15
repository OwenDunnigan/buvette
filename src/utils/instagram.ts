export interface InstagramMedia {
  id: string;
  media_url: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramFeedData {
  media: InstagramMedia[];
  lastFetched: number;
}

// In-memory cache for Instagram feed data (1 hour TTL)
let instagramCache: InstagramFeedData | null = null;
const INSTAGRAM_CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

export async function fetchInstagramFeed(): Promise<InstagramMedia[]> {
  const now = Date.now();

  // Return cached data if valid
  if (instagramCache && (now - instagramCache.lastFetched) < INSTAGRAM_CACHE_TTL) {
    return instagramCache.media;
  }

  try {
    const accountId = import.meta.env.INSTAGRAM_ACCOUNT_ID;
    const accessToken = import.meta.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accountId || !accessToken) {
      console.warn("Instagram credentials missing. Unable to fetch feed.");
      return instagramCache ? instagramCache.media : [];
    }

    const apiUrl = `https://graph.facebook.com/v25.0/${accountId}?fields=business_discovery.username(buvette.inthevillage){media{media_url,caption,timestamp}}&access_token=${accessToken}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Instagram API returned status ${response.status}: ${response.statusText}`);
      // Return stale cache if available
      return instagramCache ? instagramCache.media : [];
    }

    const data = await response.json();

    if (data?.business_discovery?.media?.data) {
      // Extract media items
      const mediaList: InstagramMedia[] = data.business_discovery.media.data;

      // Update cache (taking max 6 items)
      instagramCache = {
        media: mediaList.slice(0, 6),
        lastFetched: now,
      };

      return instagramCache.media;
    } else {
      console.error("Instagram API response structure is unexpected", data);
      return instagramCache ? instagramCache.media : [];
    }
  } catch (error) {
    console.error("Error fetching Instagram feed:", error);
    // Return stale cache if available
    return instagramCache ? instagramCache.media : [];
  }
}
