
import { adminDb } from "@/firebase/admin"; // 1. IMPORT THE SERVER-SIDE DB INSTANCE
import { unstable_cache as cache } from "next/cache";

const db = adminDb;

// Define the shape of the post object
export interface SocialPost {
  id: string;
  post_url: string;
  platform: "instagram" | "linkedin" | "youtube";
  created_at: string;
  priority: number;
}

// Uncached function to fetch directly from the database using the ADMIN SDK
async function getSocialPostsFromDB(): Promise<SocialPost[]> {
  // 2. USE THE ADMIN SDK'S API (db.collection, .where, .orderBy, .get)
  const socialPostsCollection = db.collection("social_posts");

  const linkedinQuery = socialPostsCollection
    .where("platform", "==", "linkedin")
    .orderBy("priority");

  const instagramQuery = socialPostsCollection
    .where("platform", "==", "instagram")
    .orderBy("priority");
    
  const youtubeQuery = socialPostsCollection
    .where("platform", "==", "youtube")
    .orderBy("priority");

  const [linkedinSnapshot, instagramSnapshot, youtubeSnapshot] = await Promise.all([
    linkedinQuery.get(),
    instagramQuery.get(),
    youtubeQuery.get(),
  ]);

  const linkedinPosts = linkedinSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as SocialPost)
  );
  const instagramPosts = instagramSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as SocialPost)
  );
  const youtubePosts = youtubeSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as SocialPost)
  );

  return [...linkedinPosts, ...instagramPosts, ...youtubePosts];
}

// Cached function that wraps the DB call and applies tags
export const getSocialPosts = cache(
  async () => getSocialPostsFromDB(),
  ["social-posts"], // The key for this cached data
  { tags: ["social-posts"] } // The tag for revalidation
);
